import { TaskStatus } from './task.model';

export enum HistoryAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}

export interface TaskHistory {
  id: string;
  taskId: string;
  action: HistoryAction;
  previousStatus?: TaskStatus;
  newStatus?: TaskStatus;
  timestamp: Date;
  description?: string;
  taskTitle: string;
  oldStatus?: TaskStatus;
  newStatusDetail?: TaskStatus;
  changes?: Record<string, any>;
}

export interface TaskHistoryFilter {
  taskId?: string;
  action?: HistoryAction;
  dateFrom?: Date;
  dateTo?: Date;
}
