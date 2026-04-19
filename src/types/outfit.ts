import { Item } from './wardrobe';

export type Outfit = {
  savedAt: number; // timestamp — used as unique key and display date
  mainItem: Item;
  otherItems: Item[];
  reason: string;
};
