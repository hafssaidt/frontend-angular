import { ButtonModule } from 'primeng/button';
import { Task } from '../models/task';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { QuillModule } from 'ngx-quill';
import { NoWhitespaceValidatorDirective } from '../directives/no-whitespace-validator.directive';

@Component({
  selector: 'task',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIcon,
    QuillModule,
    NoWhitespaceValidatorDirective,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  isAddMode: boolean = true;
  task!: Task;
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['code-block'],
    ],
  };
  constructor(
    public dialogRef: MatDialogRef<TaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isAddMode = data.isAddMode;
    this.task = data.task;
  }
  cancel() {
    this.task = this.data.task;
  }
}
