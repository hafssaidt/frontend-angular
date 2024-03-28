import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../models/task';

@Pipe({
  name: 'sortTasksByOrder',
  standalone: true,
})
export class SortTasksByOrderPipe implements PipeTransform {
  transform(tasks: Task[]): Task[] {
    if (!tasks) return [];
    return tasks.sort((a, b) => a.taskOrder - b.taskOrder);
  }
}
