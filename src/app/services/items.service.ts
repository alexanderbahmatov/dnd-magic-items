import { Injectable, signal, computed, inject } from '@angular/core';
import { FilterState, MagicItem, ItemType, Rarity, Source } from '../models/magic-item.model';
import { sortOptions } from './items.data';
import { FilterStorageService } from './filter-storage.service';
import {
  MOCK_ITEMS,
  MOCK_ITEM_TYPES,
  MOCK_RARITIES,
  MOCK_SOURCES,
  MOCK_ATTUNEMENTS,
} from './mock-data';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private storage = inject(FilterStorageService);

  readonly hasMore = signal(true);
  readonly pageSize = 20;

  readonly filters = signal<FilterState>({
    name: '',
    itemTypes: null,
    rarities: null,
    hasAttunement: null,
    attunements: null,
    costMin: null,
    costMax: null,
    orderOptionIndex: 0,
    skip: 0,
  });

  private readonly _items = signal<MagicItem[]>([]);
  readonly allItems = computed(() => this._items());
  readonly totalCount = signal<number>(0);

  readonly allTypes = signal<ItemType[]>(MOCK_ITEM_TYPES);
  readonly allRarities = signal<Rarity[]>(MOCK_RARITIES);
  readonly allSources = signal<Source[]>(MOCK_SOURCES);
  readonly allAttunements = signal<string[]>(MOCK_ATTUNEMENTS);

  readonly showMoreAttunements = signal(false);

  readonly filteredAttunements = computed(() => {
    const selected = new Set(this.filters().attunements ?? []);
    const sorted = [...this.allAttunements()].sort((a, b) => {
      const aS = selected.has(a), bS = selected.has(b);
      return aS === bS ? 0 : aS ? -1 : 1;
    });
    if (this.showMoreAttunements()) return sorted;
    return sorted.slice(0, Math.max(11, selected.size));
  });

  init(): void {
    const saved = this.storage.load();
    if (saved?.filter) {
      this.filters.update(f => ({ ...f, ...saved.filter, skip: 0 }));
    }
    this.fetchItems(this.filters());
  }

  updateFilter<K extends keyof FilterState>(key: K, value: FilterState[K]): void {
    this.filters.update(f => ({ ...f, [key]: value, skip: 0 }));
    this.fetchItems(this.filters());
  }

  updateFilters(partial: Partial<FilterState>): void {
    this.filters.update(f => ({ ...f, ...partial, skip: 0 }));
    this.fetchItems(this.filters());
  }

  resetFilters(): void {
    this.filters.update(f => ({
      ...f,
      name: '', itemTypes: null, rarities: null,
      hasAttunement: null, attunements: null,
      costMin: null, costMax: null, skip: 0,
    }));
    this.fetchItems(this.filters());
  }

  loadMore(onDone: () => void): void {
    if (!this.hasMore()) { onDone(); return; }
    const nextSkip = this.filters().skip + this.pageSize;
    this.filters.update(f => ({ ...f, skip: nextSkip }));
    const page = this.applyFilters(this.filters());
    this._items.update(v => [...v, ...page.items]);
    if (!page.hasMore) this.hasMore.set(false);
    onDone();
  }

  private fetchItems(f: FilterState): void {
    this.hasMore.set(true);
    const page = this.applyFilters(f);
    this._items.set(page.items);
    this.totalCount.set(page.total);
    if (!page.hasMore) this.hasMore.set(false);
  }

  private applyFilters(f: FilterState): { items: MagicItem[]; total: number; hasMore: boolean } {
    let result = [...MOCK_ITEMS];

    if (f.name) {
      const q = f.name.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) || i.nameEn.toLowerCase().includes(q)
      );
    }

    if (f.rarities?.length) {
      result = result.filter(i => i.rarityId != null && f.rarities!.includes(i.rarityId));
    }

    if (f.itemTypes?.length) {
      result = result.filter(i => i.itemTypeId != null && f.itemTypes!.includes(i.itemTypeId));
    }

    if (f.hasAttunement === true) {
      result = result.filter(i => i.attunement === true);
      if (f.attunements?.length) {
        result = result.filter(i =>
          f.attunements!.some(a => i.attunementDetail?.toLowerCase().includes(a.toLowerCase()))
        );
      }
    } else if (f.hasAttunement === false) {
      result = result.filter(i => i.attunement === false);
    }

    if (f.costMin != null) result = result.filter(i => i.costDMGMax >= f.costMin!);
    if (f.costMax != null) result = result.filter(i => i.costDMGMin <= f.costMax!);

    const total = result.length;

    const sort = sortOptions[f.orderOptionIndex]?.value;
    if (sort) {
      result.sort((a, b) => {
        let cmp = 0;
        switch (sort.field) {
          case 'name':   cmp = a.name.localeCompare(b.name, 'ru'); break;
          case 'rarity': cmp = (a.rarityId ?? 0) - (b.rarityId ?? 0); break;
          case 'type':   cmp = (a.itemTypeId ?? 0) - (b.itemTypeId ?? 0); break;
          case 'price':  cmp = (a.costDMGAvg ?? 0) - (b.costDMGAvg ?? 0); break;
        }
        return sort.direction === 1 ? -cmp : cmp;
      });
    }

    const page = result.slice(f.skip, f.skip + this.pageSize);
    return { items: page, total, hasMore: f.skip + this.pageSize < total };
  }

  readonly activeFilterCount = computed(() => {
    const f = this.filters();
    let n = 0;
    if (f.name) n++;
    if (f.rarities?.length) n += f.rarities.length;
    if (f.itemTypes?.length) n += f.itemTypes.length;
    if (f.hasAttunement !== null) n++;
    if (f.costMin != null) n++;
    if (f.costMax != null) n++;
    return n;
  });
}
