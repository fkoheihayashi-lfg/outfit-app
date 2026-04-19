import { Item, Season, Formality, ContextInput, Weather, MeetingType } from '../types';

const temperatureToSeasons = (temp: number): Season[] => {
  if (temp <= 5)  return ['winter', 'all'];
  if (temp <= 15) return ['fall', 'winter', 'all'];
  if (temp <= 22) return ['spring', 'fall', 'all'];
  return ['summer', 'spring', 'all'];
};

const FORMALITY_RANK: Formality[] = ['casual', 'smart_casual', 'business', 'formal'];

const formalityRank = (f: Formality): number => FORMALITY_RANK.indexOf(f);

const meetingMinFormality = (type: MeetingType): Formality => {
  switch (type) {
    case 'sport':  return 'casual';
    case 'casual': return 'casual';
    case 'date':   return 'smart_casual';
    case 'work':   return 'smart_casual';
    case 'formal': return 'business';
  }
};

const meetingMaxFormality = (type: MeetingType): Formality => {
  switch (type) {
    case 'sport':  return 'casual';
    case 'casual': return 'smart_casual';
    case 'date':   return 'formal';
    case 'work':   return 'formal';
    case 'formal': return 'formal';
  }
};

const isFormalityMatch = (itemFormality: Formality, meetingType: MeetingType): boolean => {
  const rank = formalityRank(itemFormality);
  return (
    rank >= formalityRank(meetingMinFormality(meetingType)) &&
    rank <= formalityRank(meetingMaxFormality(meetingType))
  );
};

const isSeasonMatch = (itemSeason: Season, temp: number): boolean =>
  temperatureToSeasons(temp).includes(itemSeason);

const isWeatherAppropriate = (item: Item, weather: Weather): boolean => {
  // Exclude casual shoes (sneakers/sandals) in rain or snow.
  if ((weather === 'rainy' || weather === 'snowy') && item.category === 'shoes') {
    return item.formality !== 'casual';
  }
  return true;
};

export const filterItems = (items: Item[], context: ContextInput): Item[] =>
  items.filter(
    (item) =>
      isSeasonMatch(item.season, context.temperature) &&
      isFormalityMatch(item.formality, context.meetingType) &&
      isWeatherAppropriate(item, context.weather)
  );

export const needsOuterLayer = (context: ContextInput): boolean =>
  context.temperature <= 15 || context.weather === 'rainy' || context.weather === 'snowy';
