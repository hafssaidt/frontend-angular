import { SubTask } from './sub-task';

export interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  taskOrder: number;
  startDate: any;
  endDate: any;
  subTasks: SubTask[];
}
