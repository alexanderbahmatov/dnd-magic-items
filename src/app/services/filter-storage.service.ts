import { Injectable } from "@angular/core";
import { BudgetPriceMode, FilterState } from "../models/magic-item.model";

const KEY = "dnd_filters";

@Injectable({ providedIn: "root" })
export class FilterStorageService {
  save(
    filters: FilterState,
    buyActive: boolean,
    budget: number,
    priceMode: BudgetPriceMode,
  ): void {
    try {
      // не сохраняем skip — он всегда начинается с 0
      const { skip, ...rest } = filters;
      localStorage.setItem(
        KEY,
        JSON.stringify({ filter: rest, buyActive, budget, priceMode }),
      );
    } catch {
      /* приватный режим браузера — игнорируем */
    }
  }

  load(): Partial<{
    filter: FilterState;
    buyActive: boolean;
    budget: number;
    priceMode: BudgetPriceMode;
  }> | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(KEY);
  }
}
