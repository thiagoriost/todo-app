/**
 * Archivo barril (barrel file) para exportaciones de modelos.
 * Centraliza todas las exportaciones de modelos del core para facilitar
 * las importaciones en otros módulos de la aplicación.
 *
 * @module core/models
 *
 * @description
 * Este archivo permite importar múltiples modelos desde una única ubicación:
 *
 * @example
 * ```typescript
 * // En lugar de múltiples imports:
 * // import { Task } from './models/task.model';
 * // import { Category } from './models/category.model';
 * // import { TaskHistory } from './models/task-history.model';
 *
 * // Se puede usar un único import:
 * import { Task, Category, TaskHistory } from './models';
 * ```
 *
 * @exports Desde task.model:
 * - TaskStatus: Enum de estados de tarea
 * - TaskPriority: Enum de prioridades
 * - Task: Interfaz de tarea
 * - CreateTaskDto: DTO para crear tarea
 * - UpdateTaskDto: DTO para actualizar tarea
 *
 * @exports Desde category.model:
 * - Category: Interfaz de categoría
 * - CreateCategoryDto: DTO para crear categoría
 *
 * @exports Desde task-history.model:
 * - HistoryAction: Enum de acciones de historial
 * - TaskHistory: Interfaz de entrada de historial
 * - TaskHistoryFilter: Interfaz para filtros de historial
 */

export * from './task.model';
export * from './category.model';
export * from './task-history.model';
