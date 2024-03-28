import { Component } from "@angular/core";
import { AppError } from "../../common/app-error";
import { BadInput } from "../../common/bad-input";
import { UserService } from "../user.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { Router, RouterModule } from "@angular/router";
import { User } from "../../models/user";
import { CheckboxModule } from "primeng/checkbox";

@Component({
  selector: "register",
  templateUrl: "./register.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    CheckboxModule,
    RouterModule,
  ],
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent {
  user: User = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
  errMsg: boolean = false;
  termsChecked = false;
  confirmPassword: string = "";
  hidePassword: boolean = true;
  hideConfPassword: boolean = true;
  constructor(private userService: UserService, private router: Router) {}

  passwordsMatch(): boolean {
    return this.user.password === this.confirmPassword;
  }

  createAccount() {
    this.userService.createAccount(this.user).subscribe(
      () => this.handleResponse(),
      (error: AppError) => {
        if (error instanceof BadInput) {
          this.errMsg = true;
          console.log(error.message);
        } else {
          alert("unexpected error!!");
          console.log(error);
        }
      }
    );
  }
  handleResponse() {
    this.router.navigateByUrl("/login");
  }
}
