import { MagicItem, BudgetPriceMode } from "../models/magic-item.model";

export interface BudgetRange {
  min: number;
  max: number | null;
}

export function getItemRange(item: MagicItem): BudgetRange | null {
  if (item.costDMGMin != null && item.costDMGMin > 0) {
    return { min: item.costDMGMin, max: item.costDMGMax ?? null };
  }
  if (item.priceDMG != null && item.priceDMG > 0) {
    return { min: item.priceDMG, max: item.priceDMG };
  }
  return null;
}

export function getExactPrice(item: MagicItem): number | null {
  if (item.priceDMG != null && item.priceDMG > 0) return item.priceDMG;
  if (item.priceXGE != null && item.priceXGE > 0) return item.priceXGE;
  const range = getItemRange(item);
  if (!range) return null;
  if (range.max == null) return range.min;
  return (range.min + range.max) / 2;
}

export function getChargePrice(
  item: MagicItem,
  mode: BudgetPriceMode,
): number | null {
  if (mode === "exact") return getExactPrice(item);
  if (mode === "rangeByMin") return item.costDMGMin ?? null;
  return item.costDMGMax ?? null;
}

export function fitsBudget(
  item: MagicItem,
  remaining: number,
  mode: BudgetPriceMode,
): boolean {
  if (mode === "exact") {
    const price = getExactPrice(item);
    return price !== null && price <= remaining;
  }
  if (mode === "rangeByMax") {
    return item.costDMGMax != null && item.costDMGMax <= remaining;
  } else {
    return item.costDMGMin != null && item.costDMGMin <= remaining;
  }
}
