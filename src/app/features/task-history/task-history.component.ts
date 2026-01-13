import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskHistoryService } from '../../core/services/task-history.service';
import { TaskHistory, HistoryAction } from '../../core/models';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-history.component.html',
  styleUrl: './task-history.component.scss'
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
