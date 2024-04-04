import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { CheckboxModule } from "primeng/checkbox";

import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Task } from "../models/task";
import { TaskService } from "../services/task.service";
import { AppError } from "../common/app-error";
import { NotFoundError } from "../common/not-found-error";
import { BadInput } from "../common/bad-input";
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { TaskComponent } from "../task/task.component";
import { MenuModule } from "primeng/menu";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "task-list",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    DragDropModule,
    MatTableModule,
    MatIconModule,
    MatButton,
    MatCheckbox,
    FormsModule,
    MenuModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.css",
})
export class TaskListComponent implements OnInit {
  task: Task = {
    id: "",
    name: "",
    description: "",
    completed: false,
    taskOrder: 0,
    startDate: null,
    endDate: null,
    subTasks: [],
  };
  status: boolean = true;
  errorMessage: string = "";
  displayedColumns: string[] = ["name", "dueDate", "actions"];
  dataSource1: Task[] = [];
  dataSource2: Task[] = [];
  audio: HTMLAudioElement = new Audio("./assets/check.mp3");
  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllTasksNotCompleted();
  }

  dropToList1(event: CdkDragDrop<Task[]>) {
    const previousIndex = this.dataSource1.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.dataSource1, previousIndex, event.currentIndex);
    const taskId = event.item.data.id;
    const newOrder = event.currentIndex;

    this.taskService.updateIndependentTaskOrder(taskId, newOrder).subscribe(
      (res: Task[]) => {
        this.dataSource1 = res.sort((a, b) => a.taskOrder - b.taskOrder);
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log("Unexpected error");
      }
    );
  }

  dropToList2(event: CdkDragDrop<Task[]>) {
    const previousIndex = this.dataSource1.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.dataSource2, previousIndex, event.currentIndex);
    const taskId = event.item.data.id;
    const newOrder = event.currentIndex;

    this.taskService.updateIndependentTaskOrder(taskId, newOrder).subscribe(
      (res: Task[]) => {
        this.dataSource2 = res.sort((a, b) => a.taskOrder - b.taskOrder);
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log("Unexpected error");
      }
    );
  }
  getAllTasksNotCompleted() {
    this.taskService.getIndependentTasks(false).subscribe(
      (res: Task[]) => {
        this.dataSource1 = res.sort((a, b) => a.taskOrder - b.taskOrder);
        this.getAllTasksCompleted();
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert("Failed to fetch incomplete tasks");
        else console.log("Unexpected error");
      }
    );
  }
  getAllTasksCompleted() {
    this.taskService.getIndependentTasks(true).subscribe(
      (res: Task[]) => {
        this.dataSource2 = res.sort((a, b) => a.taskOrder - b.taskOrder);
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert("Failed to fetch completed tasks");
        else console.log("Unexpected error");
      }
    );
  }
  async updateTaskStatusFromList1(task: Task, status: boolean) {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio.play();
    this.taskService.updateIndependentTaskStatus(task.id, status).subscribe(
      (res: any) => {
        this.dataSource1 = res.tasksUpdatedAfterTaskMove.sort(
          (a: Task, b: Task) => a.taskOrder - b.taskOrder
        );
        this.dataSource1 = [...this.dataSource1];
        this.dataSource2.push(res.movedTaskUpdated);
        this.dataSource2 = [...this.dataSource2];
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log("Unexpected error");
      }
    );
  }
  updateTaskStatusFromList2(task: Task, status: boolean) {
    this.taskService.updateIndependentTaskStatus(task.id, status).subscribe(
      (res: any) => {
        this.dataSource2 = res.tasksUpdatedAfterTaskMove.sort(
          (a: Task, b: Task) => a.taskOrder - b.taskOrder
        );
        this.dataSource2 = [...this.dataSource2];
        this.dataSource1.push(res.movedTaskUpdated);
        this.dataSource1 = [...this.dataSource1];
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log("Unexpected error");
      }
    );
  }
  addTask() {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: "660px",
      height: "560px",
      data: {
        task: this.task,
        isAddMode: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        result.task.description = result.task.description.trim();
        this.taskService.createIndependentTask(result.task).subscribe(
          (res: Task) => {
            this.dataSource1.push(res);
            this.dataSource1 = [...this.dataSource1];
            this.task = {
              id: "",
              name: "",
              description: "",
              completed: false,
              taskOrder: 0,
              startDate: null,
              endDate: null,
              subTasks: [],
            };
          },
          (error: AppError) => {
            if (error instanceof BadInput) alert(error.message);
            else console.log("Unexpected error");
          }
        );
      }
    });
  }

  updateTask(taskId: string, task: Task) {
    this.taskService.updateTask(taskId, task).subscribe(
      () => {},
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log("Unexpected error");
      }
    );
  }

  deleteTask(task: Task) {
    this.taskService.deleteIndependentTask(task.id).subscribe(
      (res: Task[]) => {
        if (!task.completed) {
          this.dataSource1 = res.sort((a, b) => a.taskOrder - b.taskOrder);
          this.dataSource1 = [...this.dataSource1];
        } else if (task.completed) {
          this.dataSource2 = res.sort((a, b) => a.taskOrder - b.taskOrder);
          this.dataSource2 = [...this.dataSource2];
        }
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert("This task is already deleted");
        else console.log("Unexpected error");
      }
    );
  }

  viewTask(taskViewed: Task) {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: "660px",
      height: "560px",
      data: {
        task: taskViewed,
        isAddMode: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.action === "save")
          this.updateTask(taskViewed.id, result.task);
        if (result.action === "delete") this.deleteTask(taskViewed);
      }
    });
  }
}
