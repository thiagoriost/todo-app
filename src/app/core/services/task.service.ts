import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models';
import { environment } from '../../../environments/environment';

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
  /** Cliente HTTP para peticiones al backend */
  private http = inject(HttpClient);

  /** URL base del API de tareas */
  private apiUrl = `${environment.apiUrl}/tasks`;

  /**
   * Obtiene todas las tareas del sistema.
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
    return this.http.get<Task[]>(this.apiUrl);
  }

  /**
   * Obtiene una tarea específica por su ID.
   *
   * @param {string} id - Identificador único de la tarea
   * @returns {Observable<Task>} Observable con la tarea encontrada
   * @throws {HttpErrorResponse} Si la tarea no existe (404)
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
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene todas las tareas de una categoría específica.
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
    return this.http.get<Task[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  /**
   * Obtiene todas las tareas con un estado específico.
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
    return this.http.get<Task[]>(`${this.apiUrl}/status/${status}`);
  }

  /**
   * Crea una nueva tarea en el sistema.
   *
   * @param {CreateTaskDto} task - Datos de la tarea a crear
   * @returns {Observable<Task>} Observable con la tarea creada (incluye ID generado)
   * @throws {HttpErrorResponse} Si la validación falla (400)
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
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Actualiza una tarea existente.
   * Permite actualización parcial de campos.
   *
   * @param {string} id - ID de la tarea a actualizar
   * @param {UpdateTaskDto} task - Datos a actualizar (campos opcionales)
   * @returns {Observable<Task>} Observable con la tarea actualizada
   * @throws {HttpErrorResponse} Si la tarea no existe (404)
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
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  /**
   * Elimina una tarea del sistema.
   * Esta operación no se puede deshacer.
   *
   * @param {string} id - ID de la tarea a eliminar
   * @returns {Observable<void>} Observable que completa cuando se elimina
   * @throws {HttpErrorResponse} Si la tarea no existe (404)
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Marca una tarea como completada.
   * Cambia el estado a COMPLETED y registra la fecha de completado.
   *
   * @param {string} id - ID de la tarea a completar
   * @returns {Observable<Task>} Observable con la tarea completada
   * @throws {HttpErrorResponse} Si la tarea no existe (404)
   *
   * @example
   * ```typescript
   * this.taskService.completeTask('123').subscribe(
   *   task => console.log('Completada:', task.completedAt)
   * );
   * ```
   */
  completeTask(id: string): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/complete`, {});
  }

  /**
   * Busca tareas por texto.
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
    return this.http.get<Task[]>(`${this.apiUrl}/search`, {
      params: { q: query }
    });
  }
}
