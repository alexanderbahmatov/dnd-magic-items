import { SortState } from '../models/magic-item.model';

export const sortOptions: { value: SortState; label: string }[] = [
  { value: { field: 'name', direction: 0 }, label: 'По названию (А→Я)' },
  { value: { field: 'name', direction: 1 }, label: 'По названию (Я→А)' },
  { value: { field: 'rarity', direction: 0 }, label: 'По редкости ↑' },
  { value: { field: 'rarity', direction: 1 }, label: 'По редкости ↓' },
  { value: { field: 'type', direction: 0 }, label: 'По типу ↑' },
  { value: { field: 'type', direction: 1 }, label: 'По типу ↓' },
  { value: { field: 'price', direction: 0 }, label: 'По цене ↑' },
  { value: { field: 'price', direction: 1 }, label: 'По цене ↓' },
];
