export interface MagicItem {
  id: string;
  name: string;
  nameEn: string;

  itemTypeId?: number;
  itemType?: ItemType;

  sourceId?: number;
  source?: Source;

  rarityId?: number;
  rarity?: Rarity;

  description: string;

  priceDMG: number;
  priceXGE: number;

  costDMG: string;
  costDMGMin: number;
  costDMGMax: number;
  costDMGAvg: number;
  costXGEFormula: string;

  attunement: boolean;
  attunementDetail?: string;

  cursed: boolean;
}

export interface ItemType {
  id: number;
  name: string;
}

export interface Rarity {
  id: number;
  name: string;
  nameEn: string;
}

export interface Source {
  id: number;
  shortName: string;
  name: string;

  sourceGroupId?: number | null;
  sourceGroup?: SourceGroup | null;
}

export interface SourceGroup {
  id: number;
  shortName: string;
  name: string;
}

export interface FilterState {
  name: string;
  itemTypes: Array<number> | null;
  rarities: Array<number> | null;
  hasAttunement: boolean | null;
  costMin: number | null;
  costMax: number | null;
  attunements: Array<string> | null;
  orderOptionIndex: number;
  skip: number;
}

export type SortOption = "name" | "rarity" | "type" | "price";

export type SortDirection = 0 | 1; // 0 = ascending, 1 = descending

export interface SortState {
  field: SortOption;
  direction: SortDirection;
}

export type AppMode = "browse" | "buy";

/** How to resolve a single numeric price out of price/cost fields, for budget checks */
export type BudgetPriceMode = "range" | "exact" | "rangeByMax" | "rangeByMin";
//  'range' -> use the min..max of the cost range (item "fits" if range overlaps remaining budget)
//  'exact' -> use a single resolved price: prefer price.dmg/xge average if both present,
//             otherwise the midpoint of the parsed cost range.

export interface CartEntry {
  item: MagicItem;
  qty: number;
}

export interface BudgetRange {
  min: number;
  max: number | null; // null = no upper bound parsed (e.g. "от 50001 зм.")
}
