import { Component, EventEmitter, inject, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BuyModeService } from "../../services/buy-mode.service";
import { getChargePrice } from "../../services/price.utils";
import { MagicItem } from "../../models/magic-item.model";

@Component({
  selector: "app-cart",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent {
  protected buy = inject(BuyModeService);
  @Output() open = new EventEmitter<MagicItem>();

  lineTotal(item: MagicItem, qty: number): number {
    const price = getChargePrice(item, this.buy.priceMode());
    return (price ?? 0) * qty;
  }

  exportCsv(): void {
    const rows = [["Предмет", "Количество", "Золото за штуку", "Золото сумма"]];
    for (const entry of this.buy.cart()) {
      const unitPrice = getChargePrice(entry.item, this.buy.priceMode()) ?? 0;
      rows.push([
        entry.item.name,
        entry.qty.toString(),
        Math.round(unitPrice).toString(),
        Math.round(unitPrice * entry.qty).toString(),
      ]);
    }
    rows.push(["Итого", "", "", Math.round(this.buy.spent()).toString()]);

    const csv = rows
      .map((r) => r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "закуп.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
}
