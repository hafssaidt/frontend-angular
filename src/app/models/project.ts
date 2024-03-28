import { Priority } from './priority';
import { Task } from './task';
export interface Project {
  id: string;
  name: string;
  description: string;
  priority: Priority;
  projectOrder: number;
  startDate: any;
  endDate: any;
  tasks: Task[];
}
