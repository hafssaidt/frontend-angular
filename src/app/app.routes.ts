import { Routes } from "@angular/router";
import { RegisterComponent } from "./auth/register/register.component";
import { LoginComponent } from "./auth/login/login.component";
import { AfterAuthGuard } from "./auth/guards/after-auth.guard";
import { TaskListComponent } from "./task-list/task-list.component";
import { AuthGuard } from "./auth/guards/auth.guard";
import { KanbanComponent } from "./kanban/kanban.component";
import { ProjectsComponent } from "./projects/projects.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { TaskListProjectComponent } from "./task-list-project/task-list-project.component";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AfterAuthGuard],
  },
  {
    path: "signup",
    component: RegisterComponent,
    canActivate: [AfterAuthGuard],
  },
  { path: "login", component: LoginComponent, canActivate: [AfterAuthGuard] },
  { path: "tasks", component: TaskListComponent, canActivate: [AuthGuard] },
  { path: "kanban", component: KanbanComponent, canActivate: [AuthGuard] },
  { path: "projects", component: ProjectsComponent, canActivate: [AuthGuard] },
  {
    path: "projects/:id/:name",
    component: TaskListProjectComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/home" },
];
