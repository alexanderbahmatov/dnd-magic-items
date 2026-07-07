import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {
  FilterState,
  ItemType,
  Rarity,
  MagicItem,
  Source,
} from "../models/magic-item.model";
import { environment } from "src/environments/environment";
import { sortOptions } from "./items.data";

/** Поменяй на свой адрес бэкенда (или относительный путь, если фронт и бэк на одном домене / есть proxy) */
const API_BASE = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class ApiService {
  private http = inject(HttpClient);

  /** POST /items */
  getItems(filter: FilterState): Observable<MagicItem[]> {
    const fixedFilter = {
      ...filter,
      orderOptions: sortOptions[filter.orderOptionIndex].value,
    };
    return this.http.post<MagicItem[]>(`${API_BASE}/items`, fixedFilter);
  }

  /** POST /items */
  getTotal(filter: FilterState): Observable<number> {
    return this.http.post<number>(`${API_BASE}/total`, filter);
  }

  /** GET /items/{id} */
  getItemById(id: string): Observable<MagicItem> {
    return this.http.get<MagicItem>(`${API_BASE}/items/${id}`);
  }

  /** GET /itemTypes */
  getItemTypes(): Observable<ItemType[]> {
    return this.http.get<ItemType[]>(`${API_BASE}/itemTypes`);
  }

  /** GET /rarities */
  getRarities(): Observable<Rarity[]> {
    return this.http.get<Rarity[]>(`${API_BASE}/rarities`);
  }

  /** GET /sources */
  getSources(): Observable<Source[]> {
    return this.http.get<Source[]>(`${API_BASE}/sources`);
  }

  /** GET /attunements */
  getAttunements(): Observable<string[]> {
    return this.http.get<string[]>(`${API_BASE}/attunements`);
  }
}
