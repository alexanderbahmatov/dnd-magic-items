import { Component, inject, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ItemsService } from "../../services/items.service";

@Component({
  selector: "app-filters",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.scss"],
})
export class FiltersComponent {
  protected svc = inject(ItemsService);
  @Output() closeModal = new EventEmitter<void>();

  get f() {
    return this.svc.filters();
  }

  toggleRarity(id: number): void {
    const current = this.f.rarities ?? [];
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    this.svc.updateFilter("rarities", next.length ? next : null);
  }

  toggleType(id: number): void {
    const current = this.f.itemTypes ?? [];
    const next = current.includes(id)
      ? current.filter((v) => v !== id)
      : [...current, id];
    this.svc.updateFilter("itemTypes", next.length ? next : null);
  }

  isRarityActive(id: number): boolean {
    return this.f.rarities?.includes(id) ?? false;
  }
  isTypeActive(id: number): boolean {
    return this.f.itemTypes?.includes(id) ?? false;
  }

  set(key: string, value: unknown): void {
    this.svc.updateFilter(key as any, value as any);
  }

  setAttunement(value: unknown): void {
    if (!value) {
      this.svc.updateFilter("attunements", null);
    }
    this.svc.updateFilter("hasAttunement", value as any);
  }

  isAttunementActive(value: string): boolean {
    return this.f.attunements?.includes(value) ?? false;
  }

  toggleAttunement(value: string): void {
    const current = this.f.attunements ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    this.svc.updateFilter("attunements", next.length ? next : null);
  }

  reset(): void {
    this.svc.resetFilters();
  }

  onOverlayClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.closeModal.emit();
  }
}
