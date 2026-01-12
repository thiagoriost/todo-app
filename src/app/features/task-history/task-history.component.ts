import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskHistoryService } from '../../core/services/task-history.service';
import { TaskHistory, HistoryAction } from '../../core/models';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="history-container">
      <h2>Historial de Tareas</h2>

      <div class="filters">
        <select (change)="filterByAction($event)" class="filter-select">
          <option value="">Todas las acciones</option>
          <option value="created">Creadas</option>
          <option value="updated">Actualizadas</option>
          <option value="status_changed">Cambio de Estado</option>
          <option value="completed">Completadas</option>
          <option value="deleted">Eliminadas</option>
        </select>

        <input
          type="date"
          (change)="filterByDate($event)"
          placeholder="Filtrar por fecha"
          class="date-filter"
        />
      </div>

      <div class="timeline">
        @if (loading()) {
          <div class="loading">Cargando historial...</div>
        } @else if (filteredHistory().length === 0) {
          <div class="empty">No hay historial disponible</div>
        } @else {
          @for (entry of filteredHistory(); track entry.id) {
            <div class="timeline-item" [class]="entry.action">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="action-badge" [class]="entry.action">
                    {{ getActionLabel(entry.action) }}
                  </span>
                  <span class="timestamp">
                    {{ formatDate(entry.timestamp) }}
                  </span>
                </div>

                <div class="timeline-body">
                  @if (entry.description) {
                    <p>{{ entry.description }}</p>
                  }

                  @if (entry.previousStatus && entry.newStatus) {
                    <div class="status-change">
                      <span class="old-status">{{ entry.previousStatus }}</span>
                      <span class="arrow">→</span>
                      <span class="new-status">{{ entry.newStatus }}</span>
                    </div>
                  }

                  @if (entry.changes && hasChanges(entry.changes)) {
                    <div class="changes">
                      <strong>Cambios:</strong>
                      <ul>
                        @for (change of getChangesList(entry.changes); track change) {
                          <li>{{ change }}</li>
                        }
                      </ul>
                    </div>
                  }
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    h2 {
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .filter-select, .date-filter {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #e0e0e0;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 24px;
    }

    .timeline-marker {
      position: absolute;
      left: -26px;
      top: 4px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2196f3;
      border: 2px solid white;
      box-shadow: 0 0 0 2px #e0e0e0;
    }

    .timeline-item.completed .timeline-marker {
      background: #4caf50;
    }

    .timeline-item.deleted .timeline-marker {
      background: #f44336;
    }

    .timeline-content {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .action-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .action-badge.created {
      background: #e3f2fd;
      color: #1976d2;
    }

    .action-badge.updated {
      background: #fff3e0;
      color: #f57c00;
    }

    .action-badge.completed {
      background: #e8f5e9;
      color: #4caf50;
    }

    .action-badge.deleted {
      background: #ffebee;
      color: #f44336;
    }

    .action-badge.status_changed {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .timestamp {
      color: #999;
      font-size: 14px;
    }

    .timeline-body p {
      margin: 0 0 8px 0;
      color: #666;
    }

    .status-change {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 8px 0;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .old-status, .new-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .old-status {
      background: #ffebee;
      color: #c62828;
    }

    .new-status {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .arrow {
      color: #999;
    }

    .changes {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .changes ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }

    .changes li {
      color: #666;
      font-size: 14px;
      margin: 4px 0;
    }

    .loading, .empty {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class TaskHistoryComponent implements OnInit {
  private historyService = inject(TaskHistoryService);

  history = signal<TaskHistory[]>([]);
  filteredHistory = signal<TaskHistory[]>([]);
  loading = signal(true);

  private selectedAction = signal<string>('');
  private selectedDate = signal<string>('');

  ngOnInit() {
    this.loadHistory();
  }

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

  filterByAction(event: Event) {
    const action = (event.target as HTMLSelectElement).value;
    this.selectedAction.set(action);
    this.applyFilters();
  }

  filterByDate(event: Event) {
    const date = (event.target as HTMLInputElement).value;
    this.selectedDate.set(date);
    this.applyFilters();
  }

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

  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  hasChanges(changes: Record<string, any>): boolean {
    return Object.keys(changes).length > 0;
  }

  getChangesList(changes: Record<string, any>): string[] {
    return Object.entries(changes).map(([key, value]) => {
      return `${key}: ${JSON.stringify(value)}`;
    });
  }
}
