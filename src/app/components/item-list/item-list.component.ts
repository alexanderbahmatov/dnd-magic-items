import {
  Component,
  inject,
  computed,
  signal,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  effect,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ItemsService } from "../../services/items.service";
import { BuyModeService } from "../../services/buy-mode.service";
import { ItemCardComponent } from "../item-card/item-card.component";
import { ItemModalComponent } from "../item-modal/item-modal.component";
import {
  MagicItem,
  SortDirection,
  SortOption,
  SortState,
} from "../../models/magic-item.model";
import { sortOptions } from "src/app/services/items.data";
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { toObservable } from "@angular/core/rxjs-interop";
import { filter, pairwise } from "rxjs";

@Component({
  selector: "app-item-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ItemCardComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: "./item-list.component.html",
  styleUrls: ["./item-list.component.scss"],
})
export class ItemListComponent {
  protected svc = inject(ItemsService);
  protected buy = inject(BuyModeService);
  protected readonly sortOptions = sortOptions;
  private prevDisplayedCount = 0;

  @Output() open = new EventEmitter<MagicItem>();
  @ViewChild("sentinel") sentinel!: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;
  protected isLoadingMore = signal(false);

  constructor() {
    // Следим за парами (было, стало) в displayedItems
    toObservable(this.displayedItems)
      .pipe(
        pairwise(), // [prev, curr]
        filter(
          ([prev, curr]) =>
            this.buy.active() && // только в buy mode
            this.svc.hasMore() && // есть ещё данные
            !this.isLoadingMore() && // не грузим прямо сейчас
            curr.length === prev.length && // видимых не прибавилось
            curr.length >= 0, // не начальное состояние
        ),
      )
      .subscribe(() => this.triggerLoadMore());
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) this.triggerLoadMore();
      },
      { threshold: 0 },
    );
    this.observer.observe(this.sentinel.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private triggerLoadMore(): void {
    if (this.isLoadingMore() || !this.svc.hasMore()) return;
    this.isLoadingMore.set(true);
    this.svc.loadMore(() => {
      this.isLoadingMore.set(false);
      // После прихода данных effect сам решит грузить ли ещё
    });
  }

  /** When buy mode is on, narrow the already text/dropdown-filtered list down to affordable items */
  readonly displayedItems = computed(() => {
    const items = this.svc.allItems();
    if (!this.buy.active()) return items;
    return this.buy.affordable(items);
  });

  readonly hiddenByBudgetCount = computed(() => {
    if (!this.buy.active()) return 0;
    return this.svc.allItems().length - this.displayedItems().length;
  });

  onSearchInput(value: string): void {
    this.svc.updateFilter("name", value);
  }

  onSortChange(value: number): void {
    this.svc.updateFilter("orderOptionIndex", value);
  }

  getOptionLabel(v: string): string {
    return v;
  }
}
