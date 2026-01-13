import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Task, Category, TaskStatus } from '../../core/models';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
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
