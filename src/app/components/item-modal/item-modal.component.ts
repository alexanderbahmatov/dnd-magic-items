import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MagicItem } from "../../models/magic-item.model";
import { BuyModeService } from "../../services/buy-mode.service";

@Component({
  selector: "app-item-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./item-modal.component.html",
  styleUrls: ["./item-modal.component.scss"],
})
export class ItemModalComponent {
  @Input({ required: true }) item!: MagicItem;
  @Output() close = new EventEmitter<void>();

  protected buy = inject(BuyModeService);

  get rarityClass(): string {
    return this.item.rarity?.nameEn ?? "";
  }

  get isAffordable(): boolean {
    return this.buy.isAffordable(this.item);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  addToCart(): void {
    this.buy.addToCart(this.item);
  }
}
