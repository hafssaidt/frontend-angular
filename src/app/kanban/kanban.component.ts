import { SubTask } from './../models/sub-task';
import { KanbanItem } from './../models/kanban-item';
import { KanbanService } from './../services/kanban.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Component, ElementRef, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AppError } from '../common/app-error';
import { BadInput } from '../common/bad-input';
import { TaskService } from '../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../models/task';
import { NotFoundError } from 'rxjs';
import { SortTasksByOrderPipe } from '../pipes/sort-tasks-by-order.pipe';
import { TaskKanbanComponent } from '../task-kanban/task-kanban.component';
import { NoWhitespaceValidatorDirective } from '../directives/no-whitespace-validator.directive';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIcon,
    MatCardModule,
    FormsModule,
    MatExpansionModule,
    MatMenuModule,
    DragDropModule,
    SortTasksByOrderPipe,
    NoWhitespaceValidatorDirective,
    MatProgressBarModule,
    ButtonModule,
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css',
})
export class KanbanComponent implements OnInit {
  editListName = false;
  showInputList = false;
  showInputCard = false;
  kanbanItems: KanbanItem[] = [];
  kanbanItem: KanbanItem = {
    id: '',
    name: '',
    kanbanItemOrder: 0,
    tasks: [],
  };
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
  openMenu = false;
  oldName!: string;
  enterKeyPressed = false;

  constructor(
    private kanbanService: KanbanService,
    private taskService: TaskService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getKanbanItems();
  }
  stateKanbanEdit: boolean[] = [];
  stateCardAdd: boolean[] = [];

  dropKanbanItem(event: CdkDragDrop<KanbanItem[]>) {
    moveItemInArray(this.kanbanItems, event.previousIndex, event.currentIndex);
    const kanbanItemId = event.item.data.id;
    const newOrder = event.currentIndex;
    console.log('kanbanItemId', kanbanItemId, 'newOrder', newOrder);
    this.kanbanService.updateKanbanItemOrder(kanbanItemId, newOrder).subscribe(
      (res: KanbanItem[]) => {
        this.kanbanItems = res.sort(
          (a, b) => a.kanbanItemOrder - b.kanbanItemOrder
        );
      },
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }
  dropTask(newKanbanItem: KanbanItem, event: CdkDragDrop<Task[]>) {
    const taskId = event.item.data.task.id;
    const newOrder = event.currentIndex;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.taskService.updateTaskOrderInKanbanItem(taskId, newOrder).subscribe(
        (res: Task[]) => {
          const i = this.kanbanItems.indexOf(newKanbanItem);
          this.kanbanItems[i].tasks = res.sort(
            (a, b) => a.taskOrder - b.taskOrder
          );
        },
        (error: AppError) => {
          if (error instanceof BadInput) alert(error.message);
          else console.log('Unexpected error');
        }
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.taskService
        .moveTaskToAnotherKanbanItem(newKanbanItem.id, taskId, newOrder)
        .subscribe(
          (res: any) => {
            const oldKanbanItem = event.item.data.kanbanItem;
            const oldIndex = this.kanbanItems.indexOf(oldKanbanItem);
            this.kanbanItems[oldIndex].tasks =
              res.tasksUpdatedInOldKanbanItem.sort(
                (a: Task, b: Task) => a.taskOrder - b.taskOrder
              );
            const newIndex = this.kanbanItems.indexOf(newKanbanItem);
            this.kanbanItems[newIndex].tasks =
              res.tasksUpdatedInNewKanbanItem.sort(
                (a: Task, b: Task) => a.taskOrder - b.taskOrder
              );
          },
          (error: AppError) => {
            if (error instanceof BadInput) alert(error.message);
            else console.log('Unexpected error');
          }
        );
    }
  }
  calculateProgress(task: Task): number {
    const countTasksCompleted = task.subTasks.filter(
      (subTask) => subTask.completed
    ).length;

    const progress = (countTasksCompleted / task.subTasks.length) * 100;
    return Math.floor(progress);
  }

  getKanbanItems() {
    return this.kanbanService
      .getKanbanItems()
      .subscribe((res: KanbanItem[]) => {
        this.kanbanItems = res.sort(
          (a, b) => a.kanbanItemOrder - b.kanbanItemOrder
        );
      });
  }
  createList() {
    if (this.kanbanItem.name?.trim() != '') {
      this.kanbanService
        .createKanbanItem(this.kanbanItem)
        .subscribe((res: KanbanItem) => {
          this.kanbanItems.push(res);
          this.kanbanItem = {
            id: '',
            name: '',
            kanbanItemOrder: 0,
            tasks: [],
          };
          this.showInputList = false;
        });
    }
  }
  openAddCard(index: number) {
    this.stateCardAdd[index] = true;
  }
  closeAddCard(index: number) {
    delete this.stateCardAdd[index];
  }
  openEdit(index: number, name: string) {
    this.oldName = name;
    this.stateKanbanEdit[index] = true;
  }
  closeEdit(index: number) {
    delete this.stateKanbanEdit[index];
  }
  onInputBlur(index: number, kanbanItemId: string, name: string) {
    if (!this.enterKeyPressed) {
      this.saveEditedListName(index, kanbanItemId, name);
    }
    this.enterKeyPressed = false;
  }
  saveEditedListName(index: number, kanbanItemId: string, name: string) {
    this.enterKeyPressed = true;
    if (name.trim() !== '' && name !== this.oldName) {
      this.kanbanService
        .updateKanbanItemName(kanbanItemId, name)
        .subscribe(() => {});
    } else {
      this.kanbanItems[index].name = this.oldName;
    }
    this.closeEdit(index);
  }
  togglePanel(element: any) {
    element.showActions = !element.showActions;
  }
  deleteList(kanbanItem: KanbanItem) {
    this.kanbanService
      .deleteKanbanItem(kanbanItem.id)
      .subscribe((res: KanbanItem[]) => {
        this.kanbanItems = res.sort(
          (a, b) => a.kanbanItemOrder - b.kanbanItemOrder
        );
      });
  }

  createCard(kanbanItem: KanbanItem) {
    if (this.task.name?.trim() != '') {
      this.taskService
        .createTaskInKanbanItem(kanbanItem.id, this.task)
        .subscribe(
          (res: Task) => {
            const i = this.kanbanItems.indexOf(kanbanItem);
            this.kanbanItems[i].tasks.push(res);
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
            this.closeAddCard(i);
          },
          (error: AppError) => {
            if (error instanceof BadInput) alert(error.message);
            else console.log('Unexpected error');
          }
        );
    }
  }

  updateTaskInKanbanItem(taskId: string, task: Task) {
    this.taskService.updateTask(taskId, task).subscribe(
      () => {},
      (error: AppError) => {
        if (error instanceof BadInput) alert(error.message);
        else console.log('Unexpected error');
      }
    );
  }

  deleteTask(kanbanItem: KanbanItem, task: Task) {
    this.taskService.deleteTaskInKanbanItem(task.id).subscribe(
      (res: Task[]) => {
        const i = this.kanbanItems.indexOf(kanbanItem);
        this.kanbanItems[i].tasks = res.sort(
          (a, b) => a.taskOrder - b.taskOrder
        );
      },
      (error: AppError) => {
        if (error instanceof NotFoundError)
          alert('This task is already deleted');
        else console.log('Unexpected error');
      }
    );
  }

  viewTask(kanbanItem: KanbanItem, taskViewed: Task) {
    taskViewed.subTasks.sort((a, b) => a.subTaskOrder - b.subTaskOrder);
    const dialogRef = this.dialog.open(TaskKanbanComponent, {
      width: '660px',
      height: '560px',
      data: {
        task: taskViewed,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('result', result);
      if (result) {
        if (result.action === 'save')
          this.updateTaskInKanbanItem(taskViewed.id, result.task);
        else if (result.action === 'delete')
          this.deleteTask(kanbanItem, taskViewed);
      }
    });
  }
}
