import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskHistoryService } from '../../core/services/task-history.service';
import { TaskHistory, HistoryAction } from '../../core/models';

/**
 * Componente para visualizar el historial de cambios de tareas.
 * Muestra una l\u00ednea de tiempo con todos los eventos y cambios
 * realizados en las tareas del sistema.
 *
 * @class TaskHistoryComponent
 * @implements {OnInit}
 *
 * @example
 * ```html
 * <app-task-history></app-task-history>
 * ```
 *
 * @description
 * Funcionalidades:
 * - Visualizaci\u00f3n en formato timeline
 * - Filtrado por tipo de acci\u00f3n
 * - Filtrado por fecha
 * - Detalles de cambios realizados
 * - Formato de fecha localizado (es-ES)
 * - Dise\u00f1o responsive mobile-first
 */
@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss'
})
export class TaskHistoryComponent implements OnInit {
  /** Servicio de historial inyectado */
  private historyService = inject(TaskHistoryService);

  /** Se\u00f1al reactiva con todo el historial */
  history = signal<TaskHistory[]>([]);

  /** Se\u00f1al reactiva con historial filtrado */
  filteredHistory = signal<TaskHistory[]>([]);

  /** Se\u00f1al que indica si se est\u00e1 cargando el historial */
  loading = signal(true);

  /** Acci\u00f3n seleccionada para filtrar (privado) */
  private selectedAction = signal<string>('');

  /** Fecha seleccionada para filtrar (privado) */
  private selectedDate = signal<string>('');

  /**
   * Hook de ciclo de vida de Angular.
   * Carga el historial al inicializar el componente.
   */
  ngOnInit() {
    this.loadHistory();
  }

  /**
   * Carga el historial completo desde el backend.
   * Aplica filtros autom\u00e1ticamente despu\u00e9s de cargar.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Recargar historial
   * this.loadHistory();
   * ```
   */
  loadHistory() {
    this.loading.set(true);
    this.historyService.getHistory().subscribe({
      next: (history) => {
        this.history.set(history);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading history:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Filtra el historial por tipo de acci\u00f3n.
   *
   * @param {Event} event - Evento del select de filtro
   * @returns {void}
   *
   * @example
   * ```html
   * <select (change)="filterByAction($event)">
   *   <option value="">Todas las acciones</option>
   *   <option value="created">Creadas</option>
   *   <option value="completed">Completadas</option>
   * </select>
   * ```
   */
  filterByAction(event: Event) {
    const action = (event.target as HTMLSelectElement).value;
    this.selectedAction.set(action);
    this.applyFilters();
  }

  /**
   * Filtra el historial por fecha espec\u00edfica.
   *
   * @param {Event} event - Evento del input de fecha
   * @returns {void}
   *
   * @example
   * ```html
   * <input type="date" (change)="filterByDate($event)">
   * ```
   */
  filterByDate(event: Event) {
    const date = (event.target as HTMLInputElement).value;
    this.selectedDate.set(date);
    this.applyFilters();
  }

  /**
   * Aplica todos los filtros activos al historial.
   * Combina filtros de acci\u00f3n y fecha.
   *
   * @returns {void}
   * @private
   */
  private applyFilters() {
    let filtered = [...this.history()];

    if (this.selectedAction()) {
      filtered = filtered.filter(h => h.action === this.selectedAction());
    }

    if (this.selectedDate()) {
      const filterDate = new Date(this.selectedDate());
      filtered = filtered.filter(h => {
        const entryDate = new Date(h.timestamp);
        return entryDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredHistory.set(filtered);
  }

  /**
   * Obtiene la etiqueta en espa\u00f1ol de una acci\u00f3n.
   *
   * @param {HistoryAction} action - Tipo de acci\u00f3n
   * @returns {string} Etiqueta traducida
   *
   * @example
   * ```html
   * <span class="action-badge">
   *   {{ getActionLabel(entry.action) }}
   * </span>
   * ```
   */
  getActionLabel(action: HistoryAction): string {
    const labels: Record<HistoryAction, string> = {
      [HistoryAction.CREATED]: 'Creada',
      [HistoryAction.UPDATED]: 'Actualizada',
      [HistoryAction.STATUS_CHANGED]: 'Cambio de Estado',
      [HistoryAction.COMPLETED]: 'Completada',
      [HistoryAction.DELETED]: 'Eliminada'
    };
    return labels[action];
  }

  /**
   * Formatea una fecha en formato legible en espa\u00f1ol.
   *
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada (ej: "13 ene 2026, 10:30")
   *
   * @example
   * ```html
   * <span class="timestamp">
   *   {{ formatDate(entry.timestamp) }}
   * </span>
   * ```
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Verifica si una entrada tiene cambios registrados.
   *
   * @param {Record<string, any>} changes - Objeto con cambios
   * @returns {boolean} true si hay cambios, false si est\u00e1 vac\u00edo
   *
   * @example
   * ```html
   * <div *ngIf="hasChanges(entry.changes)" class="changes">
   *   <!-- mostrar detalles de cambios -->
   * </div>
   * ```
   */
  hasChanges(changes: Record<string, any>): boolean {
    return Object.keys(changes).length > 0;
  }

  /**
   * Convierte el objeto de cambios en un array de strings legibles.
   *
   * @param {Record<string, any>} changes - Objeto con cambios
   * @returns {string[]} Array de strings con formato "campo: valor"
   *
   * @example
   * ```html
   * <ul>
   *   <li *ngFor="let change of getChangesList(entry.changes)">
   *     {{ change }}
   *   </li>
   * </ul>
   * ```
   */
  getChangesList(changes: Record<string, any>): string[] {
    return Object.entries(changes).map(([key, value]) => {
      return `${key}: ${JSON.stringify(value)}`;
    });
  }
}
