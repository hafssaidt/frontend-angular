import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { ProjectsService } from "../services/projects.service";
import { Project } from "../models/project";
import { NotFoundError } from "rxjs";
import { AppError } from "../common/app-error";
import { ProjectStateService } from "../services/project-state.service";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: "sidebar",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatCardModule],
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"],
})
export class SideBarComponent implements OnInit {
  public sidebarShow: boolean = true;
  projects: Project[] = [];
  showProjectsMenu = true;
  constructor(private projectStateService: ProjectStateService) {}

  ngOnInit(): void {
    this.projectStateService.fetchProjects();
    this.projectStateService.projects$.subscribe((projects) => {
      this.projects = projects;
    });
  }
  truncateProjectName(name: string): string {
    const maxLength = 23;
    if (name.length > maxLength) {
      return name.substring(0, maxLength) + "...";
    }
    return name;
  }
}
