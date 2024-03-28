import { CountTasksInKanbanItem } from './../models/count-tasks-kanban';
import { KanbanItem } from './../models/kanban-item';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { CountTask } from '../models/count-task';
import { ProgressProject } from '../models/progress-project';
import { CountTasksDate } from '../models/count-tasks-date';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private API_URL = 'http://localhost:8080/api/tasks';
  constructor(public http: HttpClient) {}

  public getIndependentTasks(completed: boolean): Observable<Task[]> {
    let params = new HttpParams().set('completed', completed);
    return this.http.get<Task[]>(`${this.API_URL}`, { params });
  }
  public getTasksInProject(
    projectId: string,
    completed: boolean
  ): Observable<Task[]> {
    let params = new HttpParams().set('completed', completed);
    return this.http.get<Task[]>(`${this.API_URL}/project/${projectId}`, {
      params,
    });
  }
  public createIndependentTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}`, task);
  }
  public createTaskInKanbanItem(
    kanbanItemId: string,
    task: Task
  ): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/kanban/${kanbanItemId}`, task);
  }
  public createTaskInProject(projectId: string, task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/project/${projectId}`, task);
  }
  public getTask(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${taskId}`);
  }
  public updateTask(taskId: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${taskId}`, task);
  }
  public updateTaskName(taskId: string, name: string): Observable<Task> {
    let params = new HttpParams().set('name', name);
    return this.http.patch<Task>(
      `${this.API_URL}/${taskId}/name`,
      {},
      { params }
    );
  }
  public updateIndependentTaskStatus(
    taskId: string,
    completed: boolean
  ): Observable<Task> {
    let params = new HttpParams().set('completed', completed);
    return this.http.patch<Task>(
      `${this.API_URL}/${taskId}/status`,
      {},
      {
        params,
      }
    );
  }
  public updateTaskStatusInProject(
    taskId: string,
    projectId: string,
    completed: boolean
  ): Observable<Task> {
    let params = new HttpParams().set('completed', completed);
    return this.http.patch<Task>(
      `${this.API_URL}/${taskId}/project/${projectId}/status`,
      {},
      {
        params,
      }
    );
  }
  public updateIndependentTaskOrder(
    taskId: string,
    newOrder: number
  ): Observable<Task[]> {
    const params = new HttpParams().set('newOrder', newOrder);
    return this.http.patch<Task[]>(
      `${this.API_URL}/${taskId}/order`,
      {},
      {
        params,
      }
    );
  }
  public updateTaskOrderInKanbanItem(
    taskId: string,
    newOrder: number
  ): Observable<Task[]> {
    let params = new HttpParams().set('newOrder', newOrder);
    return this.http.patch<Task[]>(
      `${this.API_URL}/${taskId}/kanban/order`,
      {},
      {
        params,
      }
    );
  }
  public updateTaskOrderInProject(
    taskId: string,
    projectId: string,
    newOrder: number
  ): Observable<Task[]> {
    let params = new HttpParams().set('newOrder', newOrder);
    return this.http.patch<Task[]>(
      `${this.API_URL}/${taskId}/project/${projectId}/order`,
      {},
      {
        params,
      }
    );
  }
  public moveTaskToAnotherKanbanItem(
    newKanbanItemId: string,
    taskId: string,
    newOrder: number
  ): Observable<Task[]> {
    let params = new HttpParams().set('newOrder', newOrder);
    return this.http.patch<Task[]>(
      `${this.API_URL}/${taskId}/kanban/${newKanbanItemId}/move`,
      {},
      {
        params,
      }
    );
  }
  public deleteIndependentTask(taskId: string): Observable<Task[]> {
    return this.http.delete<Task[]>(`${this.API_URL}/${taskId}`);
  }
  public deleteTaskInKanbanItem(taskId: string): Observable<Task[]> {
    return this.http.delete<Task[]>(`${this.API_URL}/${taskId}/kanban`);
  }
  public deleteTaskInProject(
    taskId: string,
    projectId: string
  ): Observable<Task[]> {
    return this.http.delete<Task[]>(
      `${this.API_URL}/${taskId}/project/${projectId}`
    );
  }
  public countTasks(): Observable<CountTask> {
    return this.http.get<CountTask>(`${this.API_URL}/count`);
  }
  public countProgressTasksProject(): Observable<ProgressProject[]> {
    return this.http.get<ProgressProject[]>(`${this.API_URL}/project/progress`);
  }
  public countTasksInKanbanItem(): Observable<CountTasksInKanbanItem[]> {
    return this.http.get<CountTasksInKanbanItem[]>(
      `${this.API_URL}/kanban/count`
    );
  }
  public countTasksByDate(): Observable<CountTasksDate[]> {
    return this.http.get<CountTasksDate[]>(`${this.API_URL}/count/date`);
  }
}
