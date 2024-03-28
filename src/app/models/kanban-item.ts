import { Task } from './task';

export interface KanbanItem {
  id: string;
  name: string;
  kanbanItemOrder: number;
  tasks: Task[];
}
