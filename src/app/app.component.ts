import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './components/filters/filters.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ModeSwitchComponent } from './components/mode-switch/mode-switch.component';
import { BuyPanelComponent } from './components/buy-panel/buy-panel.component';
import { CartComponent } from './components/cart/cart.component';
import { BuyModeService } from './services/buy-mode.service';
import { ItemsService } from './services/items.service';
import { FilterStorageService } from './services/filter-storage.service';
import { MagicItem } from './models/magic-item.model';
import { ItemModalComponent } from './components/item-modal/item-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FiltersComponent,
    ItemListComponent,
    ModeSwitchComponent,
    BuyPanelComponent,
    CartComponent,
    ItemModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  protected buy = inject(BuyModeService);
  protected svc = inject(ItemsService);
  private storage = inject(FilterStorageService);

  protected filtersOpen = false;
  protected selected: MagicItem | null = null;

  constructor() {
    // Sync filters + buy state to localStorage whenever anything changes
    effect(() => {
      this.storage.save(
        this.svc.filters(),
        this.buy.active(),
        this.buy.budget(),
        this.buy.priceMode(),
      );
    });
  }

  ngOnInit(): void {
    // Restore buy mode state from storage
    const saved = this.storage.load();
    if (saved) {
      this.buy.restore(
        saved.buyActive ?? false,
        saved.budget ?? 1000,
        saved.priceMode ?? 'exact',
      );
    }
    this.svc.init();
  }

  openItem(item: MagicItem): void { this.selected = item; }
  closeModal(): void { this.selected = null; }
}
