import { CountProjectsByPriority } from "./../models/count-projects-priority";
import { ProjectsService } from "./../services/projects.service";
import { CountTask } from "./../models/count-task";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { Chart, registerables } from "chart.js";
import { TaskService } from "../services/task.service";
import { Priority } from "../models/priority";
import { ProgressProject } from "../models/progress-project";
import { CountTasksInKanbanItem } from "../models/count-tasks-kanban";
import { CountTasksDate } from "../models/count-tasks-date";
import "chartjs-adapter-date-fns";
Chart.register(...registerables);
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent implements OnInit {
  countCompletedTasks!: number;
  countIncompleteTasks!: number;
  countTotalTasks!: number;
  countTotalProjects!: number;
  priorities!: Priority[];
  countProjByPriority!: number[];
  projectNames!: string[];
  countCompTasksInProj!: number[];
  countIncompTasksInProj!: number[];
  kanbanNames!: string[];
  countTasksInKanbans!: number[];
  dates!: Date[];
  countTasksByDates!: number[];
  constructor(
    private taskService: TaskService,
    private projectsService: ProjectsService
  ) {}
  ngOnInit(): void {
    this.countTasks();
    this.countProjects();
    this.countTasksByDate();
    this.countProjectsByPriority();
    this.countProgressTasksProject();
    this.countTasksInKanbanItem();
  }
  countTasks() {
    this.taskService.countTasks().subscribe((res: CountTask) => {
      this.countCompletedTasks = res.countCompleted;
      this.countIncompleteTasks = res.countIncomplete;
      this.countTotalTasks =
        this.countCompletedTasks + this.countIncompleteTasks;
    });
  }
  countProjects() {
    this.projectsService.countProjects().subscribe((res: number) => {
      this.countTotalProjects = res;
    });
  }

  countTasksByDate() {
    this.taskService.countTasksByDate().subscribe((res: CountTasksDate[]) => {
      this.dates = res.map((item) => item.date);
      this.countTasksByDates = res.map((item) => item.countTasks);
      this.createLineChart();
    });
  }
  createLineChart() {
    const ctx4: any = document.getElementById("lineChart") as HTMLElement;
    new Chart(ctx4, {
      type: "line",
      data: {
        labels: this.dates,
        datasets: [
          {
            label: "Task Count",
            data: this.countTasksByDates,
            borderColor: "#64B5F6",
            backgroundColor: "#64B5F6",
            cubicInterpolationMode: "monotone",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
              displayFormats: {
                day: "MMM dd",
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  countProjectsByPriority() {
    this.projectsService
      .countProjectsByPriority()
      .subscribe((res: CountProjectsByPriority[]) => {
        this.priorities = res.map((item) => item.priority);
        this.countProjByPriority = res.map((item) => item.count);
        this.createDoughnutChart();
      });
  }

  createDoughnutChart() {
    const ctx1: any = document.getElementById("doughnutChart") as HTMLElement;
    new Chart(ctx1, {
      type: "doughnut",
      data: {
        labels: this.priorities,
        datasets: [
          {
            label: "Count",
            data: this.countProjByPriority,
            backgroundColor: ["#64B5F6", "#4DB6AC", "#7986CB"],
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "60%",
      },
    });
  }

  countProgressTasksProject() {
    this.taskService
      .countProgressTasksProject()
      .subscribe((res: ProgressProject[]) => {
        this.projectNames = res.map((item) => item.projectName);
        this.countCompTasksInProj = res.map((item) => item.countCompletedTasks);
        this.countIncompTasksInProj = res.map(
          (item) => item.countIncompleteTasks
        );
        this.createStackBarChart();
      });
  }
  createStackBarChart(): void {
    const ctx2 = document.getElementById(
      "stackedBarChart"
    ) as HTMLCanvasElement;
    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: this.projectNames.map((name) =>
          name.length > 14 ? name.substring(0, 14) + "..." : name
        ),
        datasets: [
          {
            label: "Completed Tasks",
            data: this.countCompTasksInProj,
            backgroundColor: "#6573C3",
            borderColor: "#6573C3",
            borderWidth: 1,
          },
          {
            label: "Incomplete Tasks",
            data: this.countIncompTasksInProj,
            backgroundColor: "#E4E7EB",
            borderColor: "#E4E7EB",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    });
  }

  countTasksInKanbanItem() {
    this.taskService
      .countTasksInKanbanItem()
      .subscribe((res: CountTasksInKanbanItem[]) => {
        this.kanbanNames = res.map((item) => item.kanbanItemName);
        this.countTasksInKanbans = res.map((item) => item.countTasks);
        this.createBarChart();
      });
  }

  createBarChart() {
    const ctx3: any = document.getElementById("barChart") as HTMLElement;
    new Chart(ctx3, {
      type: "bar",
      data: {
        labels: this.kanbanNames.map((name) =>
          name.length > 14 ? name.substring(0, 14) + "..." : name
        ),
        datasets: [
          {
            label: "Count",
            data: this.countTasksInKanbans,
            backgroundColor: ["#64B5F6"],
          },
        ],
      },
      options: {
        responsive: true,
      },
    });
  }
}
