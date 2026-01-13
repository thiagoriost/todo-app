/**
 * Estado de una tarea en el sistema.
 * Define los diferentes estados del ciclo de vida de una tarea.
 *
 * @enum {string}
 * @readonly
 */
export enum TaskStatus {
  /** Tarea pendiente de iniciar */
  PENDING = 'pending',
  /** Tarea en proceso de ejecución */
  IN_PROGRESS = 'in_progress',
  /** Tarea completada exitosamente */
  COMPLETED = 'completed',
  /** Tarea cancelada */
  CANCELLED = 'cancelled'
}

/**
 * Nivel de prioridad de una tarea.
 * Indica la urgencia o importancia de completar la tarea.
 *
 * @enum {string}
 * @readonly
 */
export enum TaskPriority {
  /** Prioridad baja - puede esperar */
  LOW = 'low',
  /** Prioridad media - debe hacerse pronto */
  MEDIUM = 'medium',
  /** Prioridad alta - requiere atención */
  HIGH = 'high',
  /** Prioridad urgente - requiere atención inmediata */
  URGENT = 'urgent'
}

/**
 * Interfaz que representa una tarea en el sistema.
 * Contiene toda la información necesaria para gestionar y mostrar tareas.
 *
 * @interface Task
 * @property {string} id - Identificador único de la tarea
 * @property {string} title - Título descriptivo de la tarea
 * @property {string} [description] - Descripción detallada opcional
 * @property {TaskStatus} status - Estado actual de la tarea
 * @property {TaskPriority} priority - Nivel de prioridad
 * @property {string} categoryId - ID de la categoría asociada
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 * @property {Date} [completedAt] - Fecha de completado (si aplica)
 * @property {Date} [dueDate] - Fecha límite opcional
 * @property {string[]} [tags] - Etiquetas opcionales para organización
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  tags?: string[];
}

/**
 * DTO (Data Transfer Object) para crear una nueva tarea.
 * Contiene únicamente los campos necesarios para la creación.
 *
 * @interface CreateTaskDto
 * @property {string} title - Título de la tarea (requerido)
 * @property {string} [description] - Descripción opcional
 * @property {TaskPriority} priority - Prioridad de la tarea (requerido)
 * @property {string} categoryId - ID de categoría (requerido)
 * @property {Date} [dueDate] - Fecha límite opcional
 * @property {string[]} [tags] - Etiquetas opcionales
 */
export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  categoryId: string;
  dueDate?: Date;
  tags?: string[];
}

/**
 * DTO (Data Transfer Object) para actualizar una tarea existente.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 *
 * @interface UpdateTaskDto
 * @property {string} [title] - Nuevo título
 * @property {string} [description] - Nueva descripción
 * @property {TaskStatus} [status] - Nuevo estado
 * @property {TaskPriority} [priority] - Nueva prioridad
 * @property {string} [categoryId] - Nueva categoría
 * @property {Date} [dueDate] - Nueva fecha límite
 * @property {string[]} [tags] - Nuevas etiquetas
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string;
  dueDate?: Date;
  tags?: string[];
}
