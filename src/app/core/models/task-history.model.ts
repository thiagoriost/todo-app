import { TaskStatus } from './task.model';

/**
 * Tipos de acciones que pueden registrarse en el historial.
 * Representa todas las operaciones posibles sobre una tarea.
 *
 * @enum {string}
 * @readonly
 */
export enum HistoryAction {
  /** Tarea creada por primera vez */
  CREATED = 'created',
  /** Tarea actualizada (cambios en campos) */
  UPDATED = 'updated',
  /** Cambio de estado de la tarea */
  STATUS_CHANGED = 'status_changed',
  /** Tarea marcada como completada */
  COMPLETED = 'completed',
  /** Tarea eliminada del sistema */
  DELETED = 'deleted',
  /** Tarea iniciada */
  STARTED = 'started'
}

/**
 * Interfaz que representa una entrada en el historial de una tarea.
 * Registra todos los cambios y acciones realizadas sobre las tareas.
 *
 * @interface TaskHistory
 * @property {string} id - Identificador único del registro de historial
 * @property {string} taskId - ID de la tarea relacionada
 * @property {HistoryAction} action - Tipo de acción realizada
 * @property {TaskStatus} [previousStatus] - Estado anterior (en cambios de estado)
 * @property {TaskStatus} [newStatus] - Nuevo estado (en cambios de estado)
 * @property {Date} timestamp - Fecha y hora del evento
 * @property {string} [description] - Descripción adicional del cambio
 * @property {string} taskTitle - Título de la tarea en ese momento
 * @property {TaskStatus} [oldStatus] - Estado previo (alias para compatibilidad)
 * @property {TaskStatus} [newStatusDetail] - Nuevo estado (alias para compatibilidad)
 * @property {Record<string, any>} [changes] - Objeto con detalles de los cambios realizados
 *
 * @example
 * ```typescript
 * const historyEntry: TaskHistory = {
 *   id: 'h123',
 *   taskId: 't456',
 *   action: HistoryAction.STATUS_CHANGED,
 *   previousStatus: TaskStatus.IN_PROGRESS,
 *   newStatus: TaskStatus.COMPLETED,
 *   timestamp: new Date(),
 *   taskTitle: 'Implementar login',
 *   changes: { status: 'completed' }
 * };
 * ```
 */
export interface TaskHistory {
  id: string;
  taskId: string;
  action: HistoryAction;
  previousStatus?: TaskStatus;
  newStatus?: TaskStatus;
  timestamp: Date;
  description?: string;
  taskTitle?: string;
  oldStatus?: TaskStatus;
  newStatusDetail?: TaskStatus;
  changes?: Record<string, any>;
  oldValues?: any;
  newValues?: any;
}

/**
 * Interfaz para filtrar entradas del historial.
 * Todos los campos son opcionales para permitir filtros flexibles.
 *
 * @interface TaskHistoryFilter
 * @property {string} [taskId] - Filtrar por ID de tarea específica
 * @property {HistoryAction} [action] - Filtrar por tipo de acción
 * @property {Date} [dateFrom] - Fecha inicial del rango de búsqueda
 * @property {Date} [dateTo] - Fecha final del rango de búsqueda
 *
 * @example
 * ```typescript
 * const filter: TaskHistoryFilter = {
 *   action: HistoryAction.COMPLETED,
 *   dateFrom: new Date('2026-01-01'),
 *   dateTo: new Date('2026-01-31')
 * };
 * ```
 */
export interface TaskHistoryFilter {
  taskId?: string;
  action?: HistoryAction;
  dateFrom?: Date;
  dateTo?: Date;
}
