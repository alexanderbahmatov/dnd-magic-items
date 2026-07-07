import { Injectable, signal, computed } from '@angular/core';
import { MagicItem, CartEntry, BudgetPriceMode } from '../models/magic-item.model';
import { fitsBudget, getChargePrice } from './price.utils';

@Injectable({ providedIn: 'root' })
export class BuyModeService {
  readonly active = signal(false);
  readonly budget = signal<number>(1000);
  readonly priceMode = signal<BudgetPriceMode>('exact');
  readonly cart = signal<CartEntry[]>([]);

  readonly spent = computed(() =>
    this.cart().reduce((sum, entry) => {
      const price = getChargePrice(entry.item, this.priceMode());
      return sum + (price ?? 0) * entry.qty;
    }, 0)
  );

  readonly remaining = computed(() => this.budget() - this.spent());
  readonly cartCount = computed(() => this.cart().reduce((n, e) => n + e.qty, 0));

  affordable(items: MagicItem[]): MagicItem[] {
    const remaining = this.remaining();
    const mode = this.priceMode();
    return items.filter(i => fitsBudget(i, remaining, mode));
  }

  isAffordable(item: MagicItem): boolean {
    return fitsBudget(item, this.remaining(), this.priceMode());
  }

  priceLabel(item: MagicItem): string {
    const mode = this.priceMode();
    if (mode === 'exact') return `≈ ${item.costDMGAvg} зм.`;
    if (mode === 'rangeByMax') return item.costDMGMax != null ? `${item.costDMGMax} зм.` : 'цена неизвестна';
    return item.costDMGMin != null ? `${item.costDMGMin} зм.` : 'цена неизвестна';
  }

  setBudget(value: number): void { this.budget.set(Math.max(0, value)); }
  setPriceMode(mode: BudgetPriceMode): void { this.priceMode.set(mode); }
  toggleActive(): void { this.active.update(v => !v); }

  addToCart(item: MagicItem): void {
    this.cart.update(cart => {
      const idx = cart.findIndex(e => e.item === item);
      if (idx >= 0) {
        const next = [...cart];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...cart, { item, qty: 1 }];
    });
  }

  removeFromCart(item: MagicItem): void {
    this.cart.update(cart => cart.filter(e => e.item !== item));
  }

  changeQty(item: MagicItem, delta: number): void {
    this.cart.update(cart => {
      const idx = cart.findIndex(e => e.item === item);
      if (idx < 0) return cart;
      const next = [...cart];
      const qty = next[idx].qty + delta;
      if (qty <= 0) { next.splice(idx, 1); }
      else { next[idx] = { ...next[idx], qty }; }
      return next;
    });
  }

  clearCart(): void { this.cart.set([]); }

  /** Restore from storage on startup */
  restore(active: boolean, budget: number, priceMode: BudgetPriceMode): void {
    this.active.set(active);
    this.budget.set(budget);
    this.priceMode.set(priceMode);
  }
}
