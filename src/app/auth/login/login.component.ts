import { Router, RouterModule } from "@angular/router";
import { Component } from "@angular/core";
import { AccountService } from "../account.service";
import { UserService } from "../user.service";
import { AppError } from "../../common/app-error";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { TokenService } from "../token.service";
import { NotFoundError } from "../../common/not-found-error";
import { BadInput } from "../../common/bad-input";
import { ForbiddenError } from "../../common/forbidden-error";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    RouterModule,
  ],
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginReq: any = {
    email: "",
    password: "",
  };
  errMsg: boolean = false;
  hidePassword: boolean = true;
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private accountService: AccountService,
    private userService: UserService
  ) {}

  authUser() {
    this.userService.authUser(this.loginReq).subscribe(
      (response) => {
        this.handleResponse(response);
      },
      (error: AppError) => {
        if (error instanceof ForbiddenError) {
          this.errMsg = true;
          console.log(error.message);
        } else {
          alert("unexpected error!!");
          console.log(error);
        }
      }
    );
  }

  handleResponse(data: any) {
    this.tokenService.handle(data);
    this.accountService.changeStatus(true);
    this.router.navigateByUrl("/tasks");
  }
}
