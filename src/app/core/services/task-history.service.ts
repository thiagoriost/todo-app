import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskHistory, TaskHistoryFilter } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para acceder al historial de cambios de tareas.
 * Proporciona métodos para consultar el registro de todas las acciones
 * realizadas sobre las tareas del sistema.
 *
 * @class TaskHistoryService
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * constructor(private historyService: TaskHistoryService) {}
 *
 * loadRecentChanges() {
 *   this.historyService.getRecentHistory(5).subscribe(
 *     history => console.log('Últimos 5 cambios:', history)
 *   );
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class TaskHistoryService {
  /** Cliente HTTP para peticiones al backend */
  private http = inject(HttpClient);

  /** URL base del API de historial */
  private apiUrl = `${environment.apiUrl}/history`;

  /**
   * Obtiene el historial de cambios con filtros opcionales.
   * Permite filtrar por tarea, acción y rango de fechas.
   *
   * @param {TaskHistoryFilter} [filter] - Filtros opcionales para la búsqueda
   * @returns {Observable<TaskHistory[]>} Observable con entradas de historial
   *
   * @example
   * ```typescript
   * // Sin filtros - todos los registros
   * this.historyService.getHistory().subscribe(
   *   history => console.log('Todo el historial:', history)
   * );
   *
   * // Con filtros
   * const filter: TaskHistoryFilter = {
   *   action: HistoryAction.COMPLETED,
   *   dateFrom: new Date('2026-01-01')
   * };
   * this.historyService.getHistory(filter).subscribe(
   *   history => console.log('Tareas completadas:', history)
   * );
   * ```
   */
  getHistory(filter?: TaskHistoryFilter): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(this.apiUrl, {
      params: filter as any
    });
  }

  /**
   * Obtiene el historial completo de una tarea específica.
   * Retorna todos los cambios en orden cronológico.
   *
   * @param {string} taskId - ID de la tarea a consultar
   * @returns {Observable<TaskHistory[]>} Observable con historial de la tarea
   *
   * @example
   * ```typescript
   * this.historyService.getTaskHistory('task-123').subscribe(
   *   history => {
   *     console.log(`Historial de cambios: ${history.length} entradas`);
   *     history.forEach(entry => {
   *       console.log(`${entry.action} - ${entry.timestamp}`);
   *     });
   *   }
   * );
   * ```
   */
  getTaskHistory(taskId: string): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/task/${taskId}`);
  }

  /**
   * Obtiene los cambios más recientes del sistema.
   * Útil para mostrar actividad reciente o notificaciones.
   *
   * @param {number} [limit=10] - Número máximo de entradas a retornar
   * @returns {Observable<TaskHistory[]>} Observable con historial reciente
   *
   * @example
   * ```typescript
   * // Últimos 10 cambios (por defecto)
   * this.historyService.getRecentHistory().subscribe(
   *   recent => console.log('Actividad reciente:', recent)
   * );
   *
   * // Últimos 20 cambios
   * this.historyService.getRecentHistory(20).subscribe(
   *   recent => this.displayRecentActivity(recent)
   * );
   * ```
   */
  getRecentHistory(limit: number = 10): Observable<TaskHistory[]> {
    return this.http.get<TaskHistory[]>(`${this.apiUrl}/recent`, {
      params: { limit: limit.toString() }
    });
  }
}
