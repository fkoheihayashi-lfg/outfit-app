import { Item, Outfit, ContextInput, Category } from '../types';
import { filterItems, needsOuterLayer } from './contextFilter';
import { areColorsCompatible } from './colorLogic';

type OutfitBlueprint = Omit<Outfit, 'savedAt'>;

const OUTFIT_CATEGORIES: Category[] = ['top', 'bottom', 'outer', 'shoes', 'accessory'];

const pickBestFromCategory = (
  category: Category,
  candidates: Item[],
  referenceColor: string
): Item | undefined => {
  const pool = candidates.filter((i) => i.category === category);
  if (pool.length === 0) return undefined;

  const compatible = pool.filter((i) => areColorsCompatible(referenceColor, i.color));
  return compatible[0] ?? pool[0];
};

const buildReason = (mainItem: Item, context: ContextInput): string => {
  const parts: string[] = [];

  parts.push(`Built around your ${mainItem.color} ${mainItem.name}.`);

  if (context.temperature <= 10) {
    parts.push('Layered for cold weather.');
  } else if (context.temperature >= 25) {
    parts.push('Light choices for warm weather.');
  }

  if (context.weather === 'rainy') parts.push('Rain-friendly items selected.');
  if (context.weather === 'snowy') parts.push('Warm and snow-appropriate.');

  parts.push(`Suitable for a ${context.meetingType} occasion.`);

  return parts.join(' ');
};

export const generateOutfits = (
  mainItem: Item,
  wardrobe: Item[],
  context: ContextInput
): OutfitBlueprint[] => {
  const candidates = filterItems(
    wardrobe.filter((i) => i.id !== mainItem.id),
    context
  );

  const otherCategories = OUTFIT_CATEGORIES.filter((c) => c !== mainItem.category);
  const otherItems: Item[] = [];

  for (const category of otherCategories) {
    if (category === 'outer' && !needsOuterLayer(context)) continue;

    const pick = pickBestFromCategory(category, candidates, mainItem.color);
    if (pick) otherItems.push(pick);
  }

  return [{ mainItem, otherItems, reason: buildReason(mainItem, context) }];
};
