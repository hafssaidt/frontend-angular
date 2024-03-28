import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { TaskComponent } from '../task/task.component';
import { User } from '../models/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoWhitespaceValidatorDirective } from '../directives/no-whitespace-validator.directive';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    NoWhitespaceValidatorDirective,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  user!: User;
  confirmPassword: string = '';
  hidePassword: boolean = true;
  hideConfPassword: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<UserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.user.password = '';
  }

  passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }
}
