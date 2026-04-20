import { Item, Outfit, ContextInput, Category, Formality, MeetingType } from '../types';
import { filterItems, needsOuterLayer } from './contextFilter';
import { areColorsCompatible } from './colorLogic';

export type OutfitBlueprint = Omit<Outfit, 'savedAt'>;

// ─── constants ────────────────────────────────────────────────────────────────

const OUTFIT_CATEGORIES: Category[] = ['top', 'bottom', 'outer', 'shoes', 'accessory'];

const MINIMAL_PRIORITY: Record<Category, Category[]> = {
  top:       ['bottom', 'shoes', 'outer', 'accessory'],
  bottom:    ['top',    'shoes', 'outer', 'accessory'],
  outer:     ['top',    'bottom', 'shoes', 'accessory'],
  shoes:     ['top',    'bottom', 'outer', 'accessory'],
  accessory: ['top',    'bottom', 'shoes', 'outer'],
};

// Numeric rank for formality levels — used for proximity scoring.
const FORMALITY_RANK: Record<Formality, number> = {
  casual:       0,
  smart_casual: 1,
  business:     2,
  formal:       3,
};

// ─── small pure helpers ───────────────────────────────────────────────────────

const itemIds = (items: Item[]): string[] => items.map((i) => i.id);

const neededCategories = (mainCat: Category, context: ContextInput): Category[] =>
  OUTFIT_CATEGORIES.filter((c) => {
    if (c === mainCat) return false;
    if (c === 'outer' && !needsOuterLayer(context)) return false;
    return true;
  });

const meetingLabel = (type: MeetingType): string => {
  switch (type) {
    case 'casual': return 'casual everyday look';
    case 'work':   return 'work look';
    case 'date':   return 'date outfit';
    case 'formal': return 'formal occasion';
    case 'sport':  return 'sporty look';
  }
};

// ─── scoring ──────────────────────────────────────────────────────────────────

// How well a candidate coheres with a reference item (Best Match).
// Color compatibility (0–3) + formality proximity (0–2) + season specificity (0–1).
const scoreCompatibility = (candidate: Item, ref: Item): number => {
  const colorScore     = areColorsCompatible(ref.color, candidate.color) ? 3 : 0;
  const formalityDiff  = Math.abs(FORMALITY_RANK[ref.formality] - FORMALITY_RANK[candidate.formality]);
  const formalityScore = Math.max(0, 2 - formalityDiff);
  // Season-specific items score slightly higher than 'all' — more curated.
  const seasonScore    = candidate.season === 'all' ? 0 : 1;
  return colorScore + formalityScore + seasonScore;
};

// How well a candidate contrasts with a reference item while staying wearable (Contrast Look).
// Color contrast (0–2) + controlled formality shift (0–2).
// A 1-level formality shift reads as intentional; 2+ levels reads as mismatched.
const scoreContrast = (candidate: Item, ref: Item): number => {
  const colorScore     = areColorsCompatible(ref.color, candidate.color) ? 0 : 2;
  const formalityDiff  = Math.abs(FORMALITY_RANK[ref.formality] - FORMALITY_RANK[candidate.formality]);
  const formalityScore = formalityDiff === 1 ? 2 : formalityDiff === 0 ? 1 : 0;
  return colorScore + formalityScore;
};

// ─── item pickers ─────────────────────────────────────────────────────────────

// Return the highest-compatibility item in a category.
// Falls back to excluded items as a last resort (tiny wardrobe).
const pickBest = (
  category: Category,
  candidates: Item[],
  ref: Item,
  excludeIds: string[] = [],
): Item | undefined => {
  const pool = candidates.filter((i) => i.category === category && !excludeIds.includes(i.id));
  if (pool.length > 0) {
    return pool.reduce((best, item) =>
      scoreCompatibility(item, ref) > scoreCompatibility(best, ref) ? item : best
    );
  }
  const full = candidates.filter((i) => i.category === category);
  if (full.length === 0) return undefined;
  return full.reduce((best, item) =>
    scoreCompatibility(item, ref) > scoreCompatibility(best, ref) ? item : best
  );
};

// Return the highest-contrast item in a category.
// Within the non-excluded pool, prefers contrasting colors and a controlled formality shift.
// Falls back to excluded items and scores them by contrast too.
const pickContrast = (
  category: Category,
  candidates: Item[],
  ref: Item,
  excludeIds: string[] = [],
): Item | undefined => {
  const pool = candidates.filter((i) => i.category === category && !excludeIds.includes(i.id));
  if (pool.length > 0) {
    return pool.reduce((best, item) =>
      scoreContrast(item, ref) > scoreContrast(best, ref) ? item : best
    );
  }
  const full = candidates.filter((i) => i.category === category);
  if (full.length === 0) return undefined;
  return full.reduce((best, item) =>
    scoreContrast(item, ref) > scoreContrast(best, ref) ? item : best
  );
};

// ─── reason builders ──────────────────────────────────────────────────────────

const buildBestReason = (
  mainItem: Item,
  otherItems: Item[],
  context: ContextInput,
): string => {
  const first = otherItems[0];
  const { weather, temperature, meetingType } = context;

  if (!first) {
    return `Your ${mainItem.name} carries the look on its own.`;
  }

  // Weather / temperature — lead with the practical context so it reads as a full thought,
  // not a bolted-on suffix.
  if (weather === 'rainy') {
    return `Your ${mainItem.name} and ${first.name} — a rain-ready pairing. Practical without sacrificing the look.`;
  }
  if (weather === 'snowy' || temperature <= 5) {
    return `Your ${mainItem.name} and ${first.name} — layered for the cold and still put-together.`;
  }
  if (temperature <= 12) {
    return `Your ${mainItem.name} and ${first.name} sit well together. Layered just enough for the cool weather.`;
  }
  if (temperature >= 26) {
    return `Easy and light. Your ${mainItem.name} with ${first.name} keeps things effortless in the heat.`;
  }

  // Occasion-led phrasing — varied tone per context.
  switch (meetingType) {
    case 'formal':
      return `Considered and complete. Your ${mainItem.name} with ${first.name} hits the right register for a ${meetingLabel(meetingType)}.`;
    case 'work':
      return `Your ${mainItem.name} and ${first.name} keep things polished. Low effort, right result.`;
    case 'date':
      return `Your ${mainItem.name} with ${first.name} reads well together — quietly coordinated, not overdone.`;
    case 'sport':
      return `Clean and functional. Your ${mainItem.name} and ${first.name} move well together.`;
    case 'casual':
    default:
      return `Your ${mainItem.name} pulls easily with ${first.name}. Nothing fights, everything works.`;
  }
};

const buildContrastReason = (
  mainItem: Item,
  otherItems: Item[],
  context: ContextInput,
): string => {
  const { meetingType } = context;
  // Surface the item whose color most visibly contrasts with the main item.
  const contrastItem =
    otherItems.find((i) => !areColorsCompatible(mainItem.color, i.color)) ??
    otherItems[0];

  if (!contrastItem) {
    return `A different take on your ${mainItem.name} — same wardrobe, different energy.`;
  }

  const hasColorContrast = !areColorsCompatible(mainItem.color, contrastItem.color);

  if (hasColorContrast) {
    // True color contrast — phrasing varies by occasion tone.
    switch (meetingType) {
      case 'date':
        return `The ${contrastItem.color} ${contrastItem.name} is meant to stand out. Contrast is confidence.`;
      case 'formal':
      case 'work':
        return `Your ${mainItem.name} against ${contrastItem.color} ${contrastItem.name} — a considered tension that reads well dressed up.`;
      case 'sport':
        return `${mainItem.color} and ${contrastItem.color} make a bold pairing. Active, sharp, intentional.`;
      case 'casual':
      default:
        return `${mainItem.color} and ${contrastItem.color} push against each other — that's the point. Looks considered, not accidental.`;
    }
  }

  // No true color contrast — the formality shift is what differentiates this from Best Match.
  return `A different register than the Best Match. Your ${mainItem.name} with ${contrastItem.name} — same palette, shifted tone.`;
};

const buildMinimalReason = (
  mainItem: Item,
  companion: Item | undefined,
  context: ContextInput,
): string => {
  const { meetingType } = context;

  if (!companion) {
    return `Your ${mainItem.name} alone. Sometimes the edit is the look.`;
  }

  // The companion's category is the most meaningful signal for minimal phrasing.
  switch (companion.category) {
    case 'bottom':
      return `${mainItem.name} and ${companion.name} — two pieces, complete picture.`;
    case 'shoes':
      return `${companion.name} closes it out. Your ${mainItem.name} with the right shoes is the whole story.`;
    case 'outer':
      return `The ${companion.name} does the work. Your ${mainItem.name} underneath keeps it grounded.`;
    case 'accessory':
      return `One detail, well chosen. Your ${mainItem.name} with ${companion.name} — clean and intentional.`;
    case 'top':
    default:
      switch (meetingType) {
        case 'formal':
          return `Stripped back on purpose. Your ${mainItem.name} with just ${companion.name} — edited, not underdressed.`;
        case 'casual':
          return `Two pieces. Your ${mainItem.name} with ${companion.name} — easy and done.`;
        default:
          return `Your ${mainItem.name} with just ${companion.name}. Fewer decisions, cleaner result.`;
      }
  }
};

// ─── strategy builders ────────────────────────────────────────────────────────

// Strategy 1 — Best Match: maximises color harmony and formality cohesion.
const buildBestMatch = (
  mainItem: Item,
  candidates: Item[],
  context: ContextInput,
): OutfitBlueprint => {
  const otherItems: Item[] = [];
  for (const cat of neededCategories(mainItem.category, context)) {
    const pick = pickBest(cat, candidates, mainItem);
    if (pick) otherItems.push(pick);
  }
  return {
    label: 'Best Match',
    mainItem,
    otherItems,
    reason: buildBestReason(mainItem, otherItems, context),
  };
};

// Strategy 2 — Contrast Look: maximises color and formality contrast vs main item,
// while staying wearable (penalises 2+ formality level jumps).
// Excludes Best Match items first to force visible variety.
const buildContrastLook = (
  mainItem: Item,
  candidates: Item[],
  context: ContextInput,
  bestMatchItems: Item[],
): OutfitBlueprint => {
  const exclude = itemIds(bestMatchItems);
  const otherItems: Item[] = [];
  for (const cat of neededCategories(mainItem.category, context)) {
    const pick = pickContrast(cat, candidates, mainItem, exclude);
    if (pick) otherItems.push(pick);
  }
  return {
    label: 'Contrast Look',
    mainItem,
    otherItems,
    reason: buildContrastReason(mainItem, otherItems, context),
  };
};

// Strategy 3 — Minimal: main item + exactly the single best companion.
// Uses the same compatibility scoring as Best Match so the one kept piece
// is always the strongest possible pairing, not just the first found.
const buildMinimal = (
  mainItem: Item,
  candidates: Item[],
  context: ContextInput,
): OutfitBlueprint => {
  let companion: Item | undefined;
  for (const cat of MINIMAL_PRIORITY[mainItem.category]) {
    if (cat === 'outer' && !needsOuterLayer(context)) continue;
    companion = pickBest(cat, candidates, mainItem);
    if (companion) break;
  }
  return {
    label: 'Minimal',
    mainItem,
    otherItems: companion ? [companion] : [],
    reason: buildMinimalReason(mainItem, companion, context),
  };
};

// ─── public API ───────────────────────────────────────────────────────────────

export const generateOutfits = (
  mainItem: Item,
  wardrobe: Item[],
  context: ContextInput,
): OutfitBlueprint[] => {
  const candidates = filterItems(
    wardrobe.filter((i) => i.id !== mainItem.id),
    context,
  );

  const best     = buildBestMatch(mainItem, candidates, context);
  const contrast = buildContrastLook(mainItem, candidates, context, best.otherItems);
  const minimal  = buildMinimal(mainItem, candidates, context);

  return [best, contrast, minimal];
};
