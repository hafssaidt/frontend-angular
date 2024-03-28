import { Injectable } from '@angular/core';
import { BehaviorSubject, NotFoundError, Observable } from 'rxjs';
import { Project } from '../models/project';
import { ProjectsService } from './projects.service';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';

@Injectable({
  providedIn: 'root',
})
export class ProjectStateService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  constructor(private projectsService: ProjectsService) {
    this.fetchProjects();
  }

  private fetchProjects() {
    this.projectsService.getAllProjects().subscribe(
      (projects) => {
        this.projectsSubject.next(
          projects.sort((a, b) => a.projectOrder - b.projectOrder)
        );
      },
      (error: AppError) => {
        if (error instanceof NotFoundError) alert('Failed to fetch projects');
        else console.log('Unexpected error');
      }
    );
  }

  addProject(project: Project) {
    this.projectsService.createProject(project).subscribe(
      (newProject) => {
        const projects = this.projectsSubject.getValue();
        projects.push(newProject);
        this.projectsSubject.next([...projects]);
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }

  updateProject(projectId: string, project: Project) {
    this.projectsService.updateProject(projectId, project).subscribe(
      (updatedProject) => {
        const projects = this.projectsSubject.getValue();
        const index = projects.findIndex((p) => p.id === projectId);
        if (index !== -1) {
          projects[index] = updatedProject;
          this.projectsSubject.next([...projects]);
        }
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }
  updateProjectName(projectId: string, name: string) {
    this.projectsService.updateProjectName(projectId, name).subscribe(
      (updatedProject) => {
        const projects = this.projectsSubject.getValue();
        const index = projects.findIndex((p) => p.id === projectId);
        if (index !== -1) {
          projects[index] = updatedProject;
          this.projectsSubject.next([...projects]);
        }
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }

  updateOrders(projectId: string, newOrder: number) {
    this.projectsService.updateOrders(projectId, newOrder).subscribe(
      (projects: Project[]) => {
        this.projectsSubject.next(
          projects.sort((a, b) => a.projectOrder - b.projectOrder)
        );
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }
  deleteProject(projectId: string) {
    this.projectsService.deleteProject(projectId).subscribe(
      (projects) => {
        this.projectsSubject.next(
          projects.sort((a, b) => a.projectOrder - b.projectOrder)
        );
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert('This project is already deleted');
        else console.log('Unexpected error');
      }
    );
  }
}
