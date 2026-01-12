import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Task, Category, TaskStatus } from '../../core/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h2>Mis Tareas</h2>
        <div class="filters">
          <select (change)="filterByStatus($event)" class="filter-select">
            <option value="">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Progreso</option>
            <option value="completed">Completadas</option>
          </select>

          <select (change)="filterByCategory($event)" class="filter-select">
            <option value="">Todas las categorías</option>
            @for (category of categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
        </div>
      </div>

      <div class="tasks">
        @if (loading()) {
          <div class="loading">Cargando tareas...</div>
        } @else if (filteredTasks().length === 0) {
          <div class="empty">No hay tareas disponibles</div>
        } @else {
          @for (task of filteredTasks(); track task.id) {
            <div class="task-card" [class.completed]="task.status === 'completed'">
              <div class="task-header">
                <h3>{{ task.title }}</h3>
                <span class="priority" [class]="task.priority">{{ task.priority }}</span>
              </div>

              @if (task.description) {
                <p class="description">{{ task.description }}</p>
              }

              <div class="task-meta">
                <span class="category">
                  {{ getCategoryName(task.categoryId) }}
                </span>
                <span class="status">{{ getStatusLabel(task.status) }}</span>
              </div>

              <div class="task-actions">
                @if (task.status !== 'completed') {
                  <button (click)="completeTask(task.id)" class="btn-complete">
                    Completar
                  </button>
                }
                <button (click)="editTask(task.id)" class="btn-edit">
                  Editar
                </button>
                <button (click)="deleteTask(task.id)" class="btn-delete">
                  Eliminar
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .filters {
      display: flex;
      gap: 10px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .tasks {
      display: grid;
      gap: 15px;
    }

    .task-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .task-card.completed {
      opacity: 0.7;
      background: #f5f5f5;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .task-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .priority {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-transform: uppercase;
    }

    .priority.low { background: #e3f2fd; color: #1976d2; }
    .priority.medium { background: #fff3e0; color: #f57c00; }
    .priority.high { background: #ffe0b2; color: #e65100; }
    .priority.urgent { background: #ffebee; color: #c62828; }

    .description {
      margin: 10px 0;
      color: #666;
    }

    .task-meta {
      display: flex;
      gap: 10px;
      margin: 10px 0;
      font-size: 14px;
    }

    .category {
      background: #e8f5e9;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .status {
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .task-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }

    .task-actions button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-complete {
      background: #4caf50;
      color: white;
    }

    .btn-edit {
      background: #2196f3;
      color: white;
    }

    .btn-delete {
      background: #f44336;
      color: white;
    }

    .loading, .empty {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class TaskListComponent implements OnInit {
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  tasks = signal<Task[]>([]);
  categories = signal<Category[]>([]);
  filteredTasks = signal<Task[]>([]);
  loading = signal(true);

  private selectedStatus = signal<string>('');
  private selectedCategory = signal<string>('');

  ngOnInit() {
    this.loadTasks();
    this.loadCategories();
  }

  loadTasks() {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading.set(false);
      }
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.selectedStatus.set(status);
    this.applyFilters();
  }

  filterByCategory(event: Event) {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.tasks()];

    if (this.selectedStatus()) {
      filtered = filtered.filter(task => task.status === this.selectedStatus());
    }

    if (this.selectedCategory()) {
      filtered = filtered.filter(task => task.categoryId === this.selectedCategory());
    }

    this.filteredTasks.set(filtered);
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: 'Pendiente',
      [TaskStatus.IN_PROGRESS]: 'En Progreso',
      [TaskStatus.COMPLETED]: 'Completada',
      [TaskStatus.CANCELLED]: 'Cancelada'
    };
    return labels[status];
  }

  completeTask(taskId: string) {
    this.taskService.completeTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Error completing task:', error)
    });
  }

  editTask(taskId: string) {
    // TODO: Navigate to edit form
    console.log('Edit task:', taskId);
  }

  deleteTask(taskId: string) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }
}
