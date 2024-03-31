import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Project } from "../models/project";
import { CountProjectsByPriority } from "../models/count-projects-priority";
import { environment } from "../../environments/environment.dev";

@Injectable({
  providedIn: "root",
})
export class ProjectsService {
  private API_URL = `${environment.URL}/api/projects`;
  constructor(public http: HttpClient) {}

  public getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.API_URL}`);
  }
  public createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.API_URL}`, project);
  }
  public updateProject(
    projectId: string,
    project: Project
  ): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/${projectId}`, project);
  }
  public updateProjectName(
    projectId: string,
    name: string
  ): Observable<Project> {
    let params = new HttpParams().set("name", name);
    return this.http.patch<Project>(
      `${this.API_URL}/${projectId}/name`,
      {},
      { params }
    );
  }
  public updateOrders(
    projectId: string,
    newOrder: number
  ): Observable<Project[]> {
    const params = new HttpParams().set("newOrder", newOrder);
    return this.http.patch<Project[]>(
      `${this.API_URL}/${projectId}/order`,
      {},
      {
        params,
      }
    );
  }
  public deleteProject(projectId: string): Observable<Project[]> {
    return this.http.delete<Project[]>(`${this.API_URL}/${projectId}`);
  }
  public countProjects(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);
  }
  public countProjectsByPriority(): Observable<CountProjectsByPriority[]> {
    return this.http.get<CountProjectsByPriority[]>(
      `${this.API_URL}/count/priority`
    );
  }
}
