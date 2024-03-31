import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { KanbanItem } from "../models/kanban-item";
import { environment } from "../../environments/environment.dev";

@Injectable({
  providedIn: "root",
})
export class KanbanService {
  private API_URL = `${environment.URL}/api/kanbanItems`;

  constructor(private http: HttpClient) {}

  public getKanbanItems(): Observable<KanbanItem[]> {
    return this.http.get<KanbanItem[]>(this.API_URL);
  }
  public createKanbanItem(kanbanItem: KanbanItem): Observable<KanbanItem> {
    return this.http.post<KanbanItem>(this.API_URL, kanbanItem);
  }
  public updateKanbanItemName(
    kanbanId: string,
    name: string
  ): Observable<KanbanItem> {
    let params = new HttpParams().set("name", name);
    return this.http.patch<KanbanItem>(
      `${this.API_URL}/${kanbanId}/name`,
      {},
      { params }
    );
  }
  public updateKanbanItemOrder(
    kanbanItemId: string,
    newOrder: number
  ): Observable<KanbanItem[]> {
    let params = new HttpParams().set("newOrder", newOrder);
    return this.http.patch<KanbanItem[]>(
      `${this.API_URL}/${kanbanItemId}/order`,
      {},
      { params }
    );
  }
  public deleteKanbanItem(kanbanItemId: string): Observable<KanbanItem[]> {
    return this.http.delete<KanbanItem[]>(`${this.API_URL}/${kanbanItemId}`);
  }
}
