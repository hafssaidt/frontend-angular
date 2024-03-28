import { ProjectStateService } from './../services/project-state.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Task } from '../models/task';
import { TaskService } from '../services/task.service';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadInput } from '../common/bad-input';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TaskComponent } from '../task/task.component';
import { Project } from '../models/project';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'task-list-project',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDialogModule,
    DragDropModule,
    MatTableModule,
    MatIconModule,
    MatButton,
    CheckboxModule,
    FormsModule,
  ],
  templateUrl: './task-list-project.component.html',
  styleUrl: './task-list-project.component.css',
})
export class TaskListProjectComponent implements OnInit {
  task: Task = {
    id: '',
    name: '',
    description: '',
    completed: false,
    taskOrder: 0,
    startDate: null,
    endDate: null,
    subTasks: [],
  };
  status: boolean = true;
  projectId: any;
  projectName: any;
  errorMessage: string = '';
  displayedColumns: string[] = ['name', 'dueDate', 'actions'];
  dragDisabled = false;
  dataSource1: Task[] = [];
  dataSource2: Task[] = [];
  oldName = '';
  openEditName = false;
  enterKeyPressed = false;
  audio: HTMLAudioElement = new Audio('./assets/check.mp3');

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private projectStateService: ProjectStateService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id');
      this.projectName = params.get('name');
      this.getTasksNotCompletedInProject();
    });
  }

  openEdit(name: string) {
    this.oldName = name;
    this.openEditName = true;
  }
  closeEdit() {
    this.openEditName = false;
  }
  onInputBlur() {
    if (!this.enterKeyPressed) {
      this.saveEditedProjectName();
    }
    this.enterKeyPressed = false;
  }
  saveEditedProjectName() {
    //this.enterKeyPressed = true;
    if (this.projectName.trim() !== '' && this.projectName !== this.oldName) {
      this.projectStateService.updateProjectName(
        this.projectId,
        this.projectName
      );
      this.router.navigateByUrl(
        `/projects/${this.projectId}/${this.projectName}`
      );
    } else {
      this.projectName = this.oldName;
    }
    this.closeEdit();
  }

  dropToList1(event: CdkDragDrop<Task[]>) {
    const previousIndex = this.dataSource1.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.dataSource1, previousIndex, event.currentIndex);
    const taskId = event.item.data.id;
    const newOrder = event.currentIndex;

    this.taskService
      .updateTaskOrderInProject(taskId, this.projectId, newOrder)
      .subscribe(
        (res: Task[]) => {
          this.dataSource1 = res.sort((a, b) => a.taskOrder - b.taskOrder);
        },
        (error: AppError) => {
          if (error instanceof BadInput) alert(error.message);
          else console.log('Unexpected error');
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

    this.taskService
      .updateTaskOrderInProject(taskId, this.projectId, newOrder)
      .subscribe(
        (res: Task[]) => {
          this.dataSource2 = res.sort((a, b) => a.taskOrder - b.taskOrder);
        },
        (error: AppError) => {
          if (error instanceof BadInput) alert(error.message);
          else console.log('Unexpected error');
        }
      );
  }
  getTasksNotCompletedInProject() {
    this.taskService.getTasksInProject(this.projectId, false).subscribe(
      (res: Task[]) => {
        this.dataSource1 = res.sort((a, b) => a.taskOrder - b.taskOrder);
        this.getTasksCompletedInProject();
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert('Failed to fetch incomplete tasks');
        else console.log('Unexpected error');
      }
    );
  }
  getTasksCompletedInProject() {
    this.taskService.getTasksInProject(this.projectId, true).subscribe(
      (res: Task[]) => {
        this.dataSource2 = res.sort((a, b) => a.taskOrder - b.taskOrder);
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert('Failed to fetch completed tasks');
        else console.log('Unexpected error');
      }
    );
  }
  async updateTaskStatusFromList1(task: Task, status: boolean) {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio.play();
    this.taskService
      .updateTaskStatusInProject(task.id, this.projectId, status)
      .subscribe(
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
          else console.log('Unexpected error');
        }
      );
  }
  updateTaskStatusFromList2(task: Task, status: boolean) {
    this.taskService
      .updateTaskStatusInProject(task.id, this.projectId, status)
      .subscribe(
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
          else console.log('Unexpected error');
        }
      );
  }
  addTask() {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: '660px',
      height: '560px',
      data: {
        task: this.task,
        isAddMode: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.taskService
          .createTaskInProject(this.projectId, result.task)
          .subscribe(
            (res: Task) => {
              this.dataSource1.push(res);
              this.dataSource1 = [...this.dataSource1];
              this.task = {
                id: '',
                name: '',
                description: '',
                completed: false,
                taskOrder: 0,
                startDate: null,
                endDate: null,
                subTasks: [],
              };
            },
            (error: AppError) => {
              if (error instanceof BadInput) alert(error.message);
              else console.log('Unexpected error');
            }
          );
      }
    });
  }

  updateTask(taskId: string, task: Task) {
    this.taskService.updateTask(taskId, task).subscribe(
      () => {
        //this.dataSource1 = [...this.dataSource1];
        //this.dataSource2 = [...this.dataSource2];
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }

  deleteTask(task: Task) {
    this.taskService.deleteTaskInProject(task.id, this.projectId).subscribe(
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
          alert('This task is already deleted');
        else console.log('Unexpected error');
      }
    );
  }

  viewTask(taskViewed: Task) {
    const dialogRef = this.dialog.open(TaskComponent, {
      width: '660px',
      height: '560px',
      data: {
        task: taskViewed,
        isAddMode: false,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.action === 'save')
          this.updateTask(taskViewed.id, result.task);
        if (result.action === 'delete') this.deleteTask(taskViewed);
      }
    });
  }
}
