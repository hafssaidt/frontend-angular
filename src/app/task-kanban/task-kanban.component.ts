import { SubTaskService } from './../services/sub-task.service';
import { KanbanService } from './../services/kanban.service';
import { TaskService } from './../services/task.service';
import { MatListModule } from '@angular/material/list';
import { SubTask } from './../models/sub-task';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { NoWhitespaceValidatorDirective } from '../directives/no-whitespace-validator.directive';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarModule } from 'primeng/progressbar';
import { EditorModule } from 'primeng/editor';
import { QuillModule } from 'ngx-quill';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'task-kanban',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    NoWhitespaceValidatorDirective,
    MatCheckboxModule,
    MatListModule,
    MatProgressBarModule,
    ProgressBarModule,
    EditorModule,
    QuillModule,
    DragDropModule,
    ButtonModule,
    CheckboxModule,
  ],
  templateUrl: './task-kanban.component.html',
  styleUrl: './task-kanban.component.css',
})
export class TaskKanbanComponent implements OnInit {
  task!: Task;
  subTaskDto: SubTask = {
    id: '',
    name: '',
    completed: false,
    subTaskOrder: 0,
  };
  addMode: boolean = true;
  openEditName = false;
  enterKeyPressed = false;
  oldName = '';
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['code-block'],
    ],
  };
  audio: HTMLAudioElement = new Audio('./assets/check.mp3');

  constructor(
    private taskService: TaskService,
    private subTaskService: SubTaskService,
    public dialogRef: MatDialogRef<TaskKanbanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.task = this.data.task;
  }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close({ action: 'save', task: this.data.task });
    });

    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.dialogRef.close({ action: 'save', task: this.data.task });
      }
    });
  }

  calculateProgress(): number {
    const countTasksCompleted = this.task.subTasks.filter(
      (subTask) => subTask.completed
    ).length;
    return Math.floor((countTasksCompleted / this.task.subTasks.length) * 100);
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
      this.saveEditedCardName();
    }
    this.enterKeyPressed = false;
  }
  saveEditedCardName() {
    this.enterKeyPressed = true;
    if (this.task.name.trim() !== '' && this.task.name !== this.oldName) {
      this.taskService
        .updateTaskName(this.task.id, this.task.name)
        .subscribe(() => {});
    } else {
      this.task.name = this.oldName;
    }
    this.closeEdit();
  }
  cancel() {
    this.task = this.data.task;
    var i = 0;
    this.data.task.subTasks.forEach((subTask: SubTask) => {
      this.task.subTasks[i].completed = subTask.completed;
      i++;
    });
  }

  addSubTask(taskId: string) {
    if (this.subTaskDto.name?.trim() != '') {
      this.subTaskService
        .createSubTask(taskId, this.subTaskDto)
        .subscribe((res: SubTask) => {
          this.task.subTasks.push(res);
          this.subTaskDto = {
            id: '',
            name: '',
            completed: false,
            subTaskOrder: 0,
          };
        });
    }
  }
  editSubTaskName(subTask: SubTask) {
    this.subTaskDto = subTask;
    this.addMode = false;
  }
  updateSubTaskName() {
    if (this.subTaskDto.name?.trim() != '') {
      this.subTaskService
        .updateSubTaskName(this.subTaskDto.id, this.subTaskDto.name)
        .subscribe(() => {
          this.subTaskDto = {
            id: '',
            name: '',
            completed: false,
            subTaskOrder: 0,
          };
          this.addMode = true;
        });
    }
  }
  updateSubTaskStatus(subTaskId: string, completed: boolean) {
    if (completed) {
      if (this.audio && !this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
      this.audio.play();
    }
    this.subTaskService
      .updateSubTaskStatus(subTaskId, completed)
      .subscribe(() => {});
  }

  drop(event: CdkDragDrop<SubTask[]>) {
    const previousIndex = this.task.subTasks.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(this.task.subTasks, previousIndex, event.currentIndex);
    const subTaskId = event.item.data.id;
    const newOrder = event.currentIndex;
    this.updateOrders(subTaskId, this.task.id, newOrder);
  }

  updateOrders(subTaskId: string, taskId: string, newOrder: number) {
    this.subTaskService
      .updateSubTaskOrder(subTaskId, taskId, newOrder)
      .subscribe((res: SubTask[]) => {
        this.task.subTasks = res.sort(
          (a: SubTask, b: SubTask) => a.subTaskOrder - b.subTaskOrder
        );
      });
  }
  deleteSubTask() {
    this.subTaskService
      .deleteSubTask(this.subTaskDto.id, this.task.id)
      .subscribe((res: SubTask[]) => {
        this.task.subTasks = res.sort(
          (a: SubTask, b: SubTask) => a.subTaskOrder - b.subTaskOrder
        );
        this.subTaskDto = {
          id: '',
          name: '',
          completed: false,
          subTaskOrder: 0,
        };
        this.addMode = true;
      });
  }
}
