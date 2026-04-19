export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'all';

export type Formality = 'casual' | 'smart_casual' | 'business' | 'formal';

export type Category = 'top' | 'bottom' | 'outer' | 'shoes' | 'accessory';

export type Item = {
  id: string;
  name: string;
  category: Category;
  color: string;
  season: Season;
  formality: Formality;
};
