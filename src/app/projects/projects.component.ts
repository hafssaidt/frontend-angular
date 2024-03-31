import { MatIconModule } from "@angular/material/icon";
import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ProjectComponent } from "../project/project.component";
import { MatTableModule } from "@angular/material/table";

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { MatButton } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { Project } from "../models/project";
import { Priority } from "../models/priority";
import { Router } from "@angular/router";
import { ProjectStateService } from "../services/project-state.service";

@Component({
  selector: "projects",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    DragDropModule,
    MatTableModule,
    MatIconModule,
    MatButton,
  ],
  templateUrl: "./projects.component.html",
  styleUrl: "./projects.component.css",
})
export class ProjectsComponent implements OnInit {
  project: Project = {
    id: "",
    name: "",
    description: "",
    priority: Priority.LOW,
    projectOrder: 0,
    startDate: null,
    endDate: null,
    tasks: [],
  };
  status: boolean = true;
  errorMessage: string = "";

  displayedColumns: string[] = ["order", "name", "priority", "dueDate", "edit"];
  dragDisabled = true;
  dataSource: Project[] = [];
  constructor(
    private projectStateService: ProjectStateService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectStateService.projects$.subscribe((projects) => {
      this.dataSource = projects;
    });
  }

  drop(event: CdkDragDrop<Project[]>) {
    this.dragDisabled = true;

    const previousIndex = this.dataSource.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    const projectId = event.item.data.id;
    const newOrder = event.currentIndex;
    this.updateOrders(projectId, newOrder);
  }

  getPriorityClass(priority: Priority): string {
    switch (priority) {
      case Priority.LOW:
        return "low-priority";
      case Priority.MEDIUM:
        return "medium-priority";
      case Priority.HIGH:
        return "high-priority";
      default:
        return "";
    }
  }

  addProject() {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: "660px",
      height: "560px",
      data: {
        project: this.project,
        isAddMode: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.projectStateService.addProject(result.project);
        this.project = {
          id: "",
          name: "",
          description: "",
          priority: Priority.LOW,
          projectOrder: 0,
          startDate: null,
          endDate: null,
          tasks: [],
        };
      }
    });
  }

  updateProject(projectId: string, project: Project) {
    this.projectStateService.updateProject(projectId, project);
  }

  deleteProject(project: Project) {
    this.projectStateService.deleteProject(project.id);
  }
  viewProject(projectViewed: Project) {
    const dialogRef = this.dialog.open(ProjectComponent, {
      width: "660px",
      height: "560px",
      data: {
        project: projectViewed,
        isAddMode: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.action === "save")
          this.updateProject(projectViewed.id, result.project);
        if (result.action === "delete") this.deleteProject(projectViewed);
      }
    });
  }

  updateOrders(projectId: string, newOrder: number) {
    this.projectStateService.updateOrders(projectId, newOrder);
  }
  displayTasks(projectId: string, projectName: string) {
    this.router.navigateByUrl(`projects/${projectId}/${projectName}`);
  }
}
