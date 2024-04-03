import { environment } from "../../environments/environment.dev";
import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { SkipLoading } from "../interceptors/loader.interceptor";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private API_URL = `${environment.URL}/api/users`;
  constructor(private http: HttpClient) {}

  public createAccount(user: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/signup`, user);
  }
  public authUser(loginReq: User): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/login`, loginReq);
  }
  public getUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile`);
  }
  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.API_URL}`, user);
  }
  public deleteUser(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}`);
  }
}
