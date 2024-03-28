import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SubTask } from '../models/sub-task';

@Injectable({
  providedIn: 'root',
})
export class SubTaskService {
  private API_URL = 'http://localhost:8080/api/subTasks';
  constructor(public http: HttpClient) {}

  public getAllSubTasks(taskId: String): Observable<SubTask[]> {
    return this.http.get<SubTask[]>(`${this.API_URL}/task/${taskId}`);
  }
  public createSubTask(taskId: String, subTask: SubTask): Observable<SubTask> {
    return this.http.post<SubTask>(`${this.API_URL}/task/${taskId}`, subTask);
  }
  public updateSubTaskName(
    subTaskId: string,
    name: string
  ): Observable<SubTask> {
    const params = new HttpParams().set('name', name);
    return this.http.patch<SubTask>(
      `${this.API_URL}/${subTaskId}/name`,
      {},
      {
        params,
      }
    );
  }
  public updateSubTaskStatus(
    subTaskId: string,
    status: boolean
  ): Observable<SubTask> {
    const params = new HttpParams().set('completed', status);
    return this.http.patch<SubTask>(
      `${this.API_URL}/${subTaskId}/status`,
      {},
      {
        params,
      }
    );
  }
  public updateSubTaskOrder(
    subTaskId: string,
    taskId: string,
    newOrder: number
  ): Observable<SubTask[]> {
    const params = new HttpParams().set('newOrder', newOrder);
    return this.http.patch<SubTask[]>(
      `${this.API_URL}/${subTaskId}/task/${taskId}/order`,
      {},
      {
        params,
      }
    );
  }

  public deleteSubTask(
    subTaskId: string,
    taskId: string
  ): Observable<SubTask[]> {
    return this.http.delete<SubTask[]>(
      `${this.API_URL}/${subTaskId}/task/${taskId}`
    );
  }
  /*public countSubTasks(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/count`);}*/
}
