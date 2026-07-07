import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BuyModeService } from '../../services/buy-mode.service';
import { BudgetPriceMode } from '../../models/magic-item.model';

@Component({
  selector: 'app-buy-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buy-panel.component.html',
  styleUrls: ['./buy-panel.component.scss'],
})
export class BuyPanelComponent {
  protected buy = inject(BuyModeService);

  get budgetStr(): string { return this.buy.budget().toString(); }
  set budgetStr(v: string) { this.buy.setBudget(parseFloat(v) || 0); }

  setPriceMode(mode: BudgetPriceMode) { this.buy.setPriceMode(mode); }

  get remainingPercent(): number {
    const budget = this.buy.budget();
    if (budget <= 0) return 0;
    return Math.max(0, Math.min(100, (this.buy.remaining() / budget) * 100));
  }

  get isOverBudget(): boolean {
    return this.buy.remaining() < 0;
  }
}
