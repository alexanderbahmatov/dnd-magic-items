import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MagicItem } from "../../models/magic-item.model";
import { BuyModeService } from "../../services/buy-mode.service";

@Component({
  selector: "app-item-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./item-card.component.html",
  styleUrls: ["./item-card.component.scss"],
})
export class ItemCardComponent {
  @Input({ required: true }) item!: MagicItem;
  @Output() open = new EventEmitter<MagicItem>();

  protected buy = inject(BuyModeService);

  get rarityClass(): string {
    return this.item.rarity?.nameEn ?? "";
  }

  get description(): string {
    const tmp = document.createElement("div");
    tmp.innerHTML = this.item.description ?? "";
    return tmp.textContent ?? "";
  }

  get priceDisplay(): string | null {
    return this.item.costDMG;
  }

  get isAffordable(): boolean {
    return this.buy.isAffordable(this.item);
  }

  get buyPriceLabel(): string {
    return this.buy.priceLabel(this.item);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    this.buy.addToCart(this.item);
  }
}
