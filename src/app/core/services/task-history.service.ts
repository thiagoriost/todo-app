import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TaskHistory, TaskHistoryFilter, HistoryAction } from '../models';

/**
 * Servicio para acceder al historial de cambios de tareas con localStorage.
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
  /** Clave para almacenar historial en localStorage */
  private readonly STORAGE_KEY = 'todoapp_history';

  /** Clave para contador de IDs */
  private readonly COUNTER_KEY = 'todoapp_history_counter';

  /**
   * Carga historial desde localStorage
   * @private
   */
  private loadHistory(): TaskHistory[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda historial en localStorage
   * @private
   */
  private saveHistory(history: TaskHistory[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Genera un nuevo ID único para entradas de historial
   * @private
   */
  private generateId(): string {
    const counter = this.getCounter();
    this.setCounter(counter + 1);
    return `history-${counter}`;
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
   * Agrega una nueva entrada al historial
   * @internal
   */
  addHistoryEntry(taskId: string, action: HistoryAction, oldValues?: any, newValues?: any): void {
    const history = this.loadHistory();

    const entry: TaskHistory = {
      id: this.generateId(),
      taskId,
      action,
      timestamp: new Date(),
      oldValues,
      newValues
    };

    history.unshift(entry); // Agregar al inicio

    // Limitar el historial a 1000 entradas
    if (history.length > 1000) {
      history.splice(1000);
    }

    this.saveHistory(history);
  }

  /**
   * Obtiene el historial de cambios con filtros opcionales desde localStorage.
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
    let history = this.loadHistory();

    if (filter) {
      if (filter.taskId) {
        history = history.filter(h => h.taskId === filter.taskId);
      }
      if (filter.action) {
        history = history.filter(h => h.action === filter.action);
      }
      if (filter.dateFrom) {
        const fromDate = new Date(filter.dateFrom).getTime();
        history = history.filter(h => new Date(h.timestamp).getTime() >= fromDate);
      }
      if (filter.dateTo) {
        const toDate = new Date(filter.dateTo).getTime();
        history = history.filter(h => new Date(h.timestamp).getTime() <= toDate);
      }
    }

    return of(history);
  }

  /**
   * Obtiene el historial completo de una tarea específica desde localStorage.
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
    const history = this.loadHistory();
    const filtered = history.filter(h => h.taskId === taskId);
    return of(filtered);
  }

  /**
   * Obtiene los cambios más recientes del sistema desde localStorage.
   * Útil para mostrar actividad reciente o notificaciones.
   *
   * @param {number} [limit=10] - Número máximo de entradas a retornar
   * @returns {Observable<TaskHistory[]>} Observable con historial reciente
   *
   * @example
   * ```typescript
   * // Últimos 10 cambios (por defecto)
   * this.historyService.getRecentHistory().subscribe(
   *   history => console.log('Actividad reciente:', history)
   * );
   *
   * // Últimos 20 cambios
   * this.historyService.getRecentHistory(20).subscribe(
   *   history => console.log('Últimos 20:', history)
   * );
   * ```
   */
  getRecentHistory(limit: number = 10): Observable<TaskHistory[]> {
    const history = this.loadHistory();
    const recent = history.slice(0, limit);
    return of(recent);
  }
}
