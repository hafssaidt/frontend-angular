import { MatButtonModule } from '@angular/material/button';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Project } from '../models/project';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'project',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    QuillModule,
    MatIcon,
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  isAddMode: boolean = true;
  project!: Project;
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['code-block'],
    ],
  };
  constructor(
    public dialogRef: MatDialogRef<ProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isAddMode = this.data.isAddMode;
    this.project = this.data.project;
  }
  cancel() {
    this.project = this.data.project;
  }
}
