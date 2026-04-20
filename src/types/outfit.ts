import { Item } from './wardrobe';

export type Outfit = {
  savedAt:   number;  // timestamp — unique key, set by the store on save
  label:     string;  // e.g. "Best Match", "Contrast Look", "Minimal"
  mainItem:  Item;
  otherItems: Item[];
  reason:    string;
};
