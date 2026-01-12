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
  changes?: Record<string, any>;
  timestamp: Date;
  description?: string;
}

export interface TaskHistoryFilter {
  taskId?: string;
  action?: HistoryAction;
  dateFrom?: Date;
  dateTo?: Date;
}
