import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, HistoryAction } from '../models';
import { TaskHistoryService } from './task-history.service';

/**
 * Servicio para gestionar operaciones CRUD de tareas.
 * Proporciona métodos para crear, leer, actualizar y eliminar tareas,
 * así como funcionalidades adicionales de filtrado y búsqueda.
 *
 * @class TaskService
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * constructor(private taskService: TaskService) {}
 *
 * loadTasks() {
 *   this.taskService.getTasks().subscribe(tasks => {
 *     console.log('Tareas cargadas:', tasks);
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // /** Cliente HTTP para peticiones al backend */
  // private http = inject(HttpClient);

  // /** URL base del API de tareas */
  // private apiUrl = `${environment.apiUrl}/tasks`;

  /** Clave para almacenar tareas en localStorage */
  private readonly STORAGE_KEY = 'todoapp_tasks';

  /** Clave para contador de IDs */
  private readonly COUNTER_KEY = 'todoapp_tasks_counter';

  /** Servicio de historial para registrar cambios */
  private historyService = inject(TaskHistoryService);

  /**
   * Obtiene todas las tareas del sistema desde localStorage.
   *
   * @returns {Observable<Task[]>} Observable con array de tareas
   *
   * @example
   * ```typescript
   * this.taskService.getTasks().subscribe({
   *   next: (tasks) => console.log(tasks),
   *   error: (error) => console.error(error)
   * });
   * ```
   */
  getTasks(): Observable<Task[]> {
    // return this.http.get<Task[]>(this.apiUrl);
    const tasks = this.loadTasks();
    return of(tasks);
  }

  /**
   * Carga tareas desde localStorage
   * @private
   */
  private loadTasks(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda tareas en localStorage
   * @private
   */
  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  /**
   * Genera un nuevo ID único para tareas
   * @private
   */
  private generateId(): string {
    const counter = this.getCounter();
    this.setCounter(counter + 1);
    return `task-${counter}`;
  }

  /**
   * Obtiene el contador actual de IDs
   * @private
   */
  private getCounter(): number {
    const counter = localStorage.getItem(this.COUNTER_KEY);
    return counter ? parseInt(counter, 10) : 1;
  }

  /**
   * Establece el valor del contador de IDs
   * @private
   */
  private setCounter(value: number): void {
    localStorage.setItem(this.COUNTER_KEY, value.toString());
  }

  /**
   * Registra un cambio en el historial
   * @private
   */
  private addToHistory(taskId: string, action: HistoryAction, oldValues?: any, newValues?: any): void {
    this.historyService.addHistoryEntry(taskId, action, oldValues, newValues);
  }

  /**
   * Obtiene una tarea específica por su ID desde localStorage.
   *
   * @param {string} id - Identificador único de la tarea
   * @returns {Observable<Task>} Observable con la tarea encontrada
   * @throws Error si la tarea no existe
   *
   * @example
   * ```typescript
   * this.taskService.getTaskById('123').subscribe({
   *   next: (task) => console.log('Tarea:', task),
   *   error: (err) => console.error('No encontrada')
   * });
   * ```
   */
  getTaskById(id: string): Observable<Task> {
    //  return this.http.get<Task>(`${this.apiUrl}/${id}`);
    const tasks = this.loadTasks();
    const task = tasks.find(t => t.id === id);
    return task ? of(task) : throwError(() => new Error(`Tarea ${id} no encontrada`));
  }

  /**
   * Obtiene todas las tareas de una categoría específica desde localStorage.
   *
   * @param {string} categoryId - ID de la categoría a filtrar
   * @returns {Observable<Task[]>} Observable con tareas de la categoría
   *
   * @example
   * ```typescript
   * this.taskService.getTasksByCategory('cat-123').subscribe(
   *   tasks => console.log('Tareas de trabajo:', tasks)
   * );
   * ```
   */
  getTasksByCategory(categoryId: string): Observable<Task[]> {
    // return this.http.get<Task[]>(`${this.apiUrl}/category/${categoryId}`);
    const tasks = this.loadTasks();
    const filtered = tasks.filter(t => t.categoryId === categoryId);
    return of(filtered);
  }

  /**
   * Obtiene todas las tareas con un estado específico desde localStorage.
   *
   * @param {TaskStatus} status - Estado por el cual filtrar
   * @returns {Observable<Task[]>} Observable con tareas filtradas
   *
   * @example
   * ```typescript
   * this.taskService.getTasksByStatus(TaskStatus.COMPLETED).subscribe(
   *   tasks => console.log('Tareas completadas:', tasks)
   * );
   * ```
   */
  getTasksByStatus(status: TaskStatus): Observable<Task[]> {
    // return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`);
    const tasks = this.loadTasks();
    const filtered = tasks.filter(t => t.status === status);
    return of(filtered);
  }

  /**
   * Crea una nueva tarea en localStorage.
   *
   * @param {CreateTaskDto} task - Datos de la tarea a crear
   * @returns {Observable<Task>} Observable con la tarea creada (incluye ID generado)
   *
   * @example
   * ```typescript
   * const newTask: CreateTaskDto = {
   *   title: 'Nueva tarea',
   *   priority: TaskPriority.HIGH,
   *   categoryId: 'cat-123'
   * };
   * this.taskService.createTask(newTask).subscribe(
   *   task => console.log('Tarea creada:', task)
   * );
   * ```
   */
  createTask(task: CreateTaskDto): Observable<Task> {
    // return this.http.post<Task>(this.apiUrl, task);
    const tasks = this.loadTasks();
    const now = new Date().toISOString();

    const newTask: Task = {
      id: this.generateId(),
      ...task,
      status: task.status || TaskStatus.PENDING,
      createdAt: now,
      updatedAt: now
    };

    tasks.push(newTask);
    this.saveTasks(tasks);

    // Registrar en historial
    this.addToHistory(newTask.id, HistoryAction.CREATED, undefined, newTask);

    return of(newTask);
  }

  /**
   * Actualiza una tarea existente en localStorage.
   * Permite actualización parcial de campos.
   *
   * @param {string} id - ID de la tarea a actualizar
   * @param {UpdateTaskDto} task - Datos a actualizar (campos opcionales)
   * @returns {Observable<Task>} Observable con la tarea actualizada
   * @throws Error si la tarea no existe
   *
   * @example
   * ```typescript
   * const updates: UpdateTaskDto = {
   *   title: 'Título actualizado',
   *   priority: TaskPriority.URGENT
   * };
   * this.taskService.updateTask('123', updates).subscribe(
   *   task => console.log('Actualizada:', task)
   * );
   * ```
   */
  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    // return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
    const tasks = this.loadTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Tarea ${id} no encontrada`));
    }

    const oldTask = { ...tasks[index] };
    const updatedTask: Task = {
      ...tasks[index],
      ...task,
      id, // Mantener el ID original
      updatedAt: new Date().toISOString()
    };

    tasks[index] = updatedTask;
    this.saveTasks(tasks);

    // Determinar tipo de acción para el historial
    let action = HistoryAction.UPDATED;
    if (oldTask.status !== updatedTask.status) {
      if (updatedTask.status === TaskStatus.COMPLETED) {
        action = HistoryAction.COMPLETED;
      } else if (updatedTask.status === TaskStatus.IN_PROGRESS) {
        action = HistoryAction.STARTED;
      }
    }

    this.addToHistory(id, action, oldTask, updatedTask);

    return of(updatedTask);
  }

  /**
   * Elimina una tarea del sistema (localStorage).
   * Esta operación no se puede deshacer.
   *
   * @param {string} id - ID de la tarea a eliminar
   * @returns {Observable<void>} Observable que completa cuando se elimina
   * @throws Error si la tarea no existe
   *
   * @example
   * ```typescript
   * if (confirm('¿Eliminar tarea?')) {
   *   this.taskService.deleteTask('123').subscribe(
   *     () => console.log('Tarea eliminada')
   *   );
   * }
   * ```
   */
  deleteTask(id: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    const tasks = this.loadTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Tarea ${id} no encontrada`));
    }

    const deletedTask = tasks[index];
    tasks.splice(index, 1);
    this.saveTasks(tasks);

    // Registrar en historial
    this.addToHistory(id, HistoryAction.DELETED, deletedTask, undefined);

    return of(void 0);
  }

  /**
   * Marca una tarea como completada.
   * Cambia el estado a COMPLETED y registra la fecha de completado.
   *
   * @param {string} id - ID de la tarea a completar
   * @returns {Observable<Task>} Observable con la tarea completada
   * @throws Error si la tarea no existe
   *
   * @example
   * ```typescript
   * this.taskService.completeTask('123').subscribe(
   *   task => console.log('Completada:', task.completedAt)
   * );
   * ```
   */
  completeTask(id: string): Observable<Task> {
    // return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {});
    const tasks = this.loadTasks();
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Tarea ${id} no encontrada`));
    }

    const oldTask = { ...tasks[index] };
    const now = new Date().toISOString();

    tasks[index] = {
      ...tasks[index],
      status: TaskStatus.COMPLETED,
      completedAt: now,
      updatedAt: now
    };

    this.saveTasks(tasks);
    this.addToHistory(id, HistoryAction.COMPLETED, oldTask, tasks[index]);

    return of(tasks[index]);
  }

  /**
   * Busca tareas por texto en localStorage.
   * Busca coincidencias en título, descripción y etiquetas.
   *
   * @param {string} query - Texto de búsqueda
   * @returns {Observable<Task[]>} Observable con tareas que coinciden
   *
   * @example
   * ```typescript
   * this.taskService.searchTasks('urgente').subscribe(
   *   tasks => console.log('Resultados:', tasks)
   * );
   * ```
   */
  searchTasks(query: string): Observable<Task[]> {
    /* return this.http.get<Task[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    }); */
    const tasks = this.loadTasks();
    const lowerQuery = query.toLowerCase();

    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description?.toLowerCase().includes(lowerQuery) ||
      task.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return of(filtered);
  }
}
