import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Task, Category, TaskStatus } from '../../core/models';
import { UiStateService } from '../../core/services/ui-state.service';

/**
 * Componente para listar y gestionar tareas.
 * Muestra todas las tareas con opciones de filtrado por estado y categoría,
 * y permite realizar acciones como completar, editar o eliminar tareas.
 *
 * @class TaskListComponent
 * @implements {OnInit}
 *
 * @example
 * ```html
 * <!-- Uso en template -->
 * <app-task-list></app-task-list>
 * ```
 *
 * @description
 * Características principales:
 * - Listado completo de tareas
 * - Filtrado por estado (pendiente, en progreso, completada, cancelada)
 * - Filtrado por categoría
 * - Marcar tareas como completadas
 * - Editar y eliminar tareas
 * - Diseño responsive mobile-first
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  /** Servicio de tareas inyectado */
  private taskService = inject(TaskService);

  /** Servicio de categorías inyectado */
  private categoryService = inject(CategoryService);

  /** Señal reactiva con todas las tareas del sistema */
  tasks = signal<Task[]>([]);

  /** Señal reactiva con todas las categorías disponibles */
  categories = signal<Category[]>([]);

  /** Señal reactiva con tareas filtradas según criterios seleccionados */
  filteredTasks = signal<Task[]>([]);

  /** Señal que indica si se están cargando las tareas */
  loading = signal(true);

  /** Estado seleccionado para filtrar (privado) */
  private selectedStatus = signal<string>('');

  /** Categoría seleccionada para filtrar (privado) */
  private selectedCategory = signal<string>('');

  /** Servicio de estado de UI inyectado */
  uiState = inject(UiStateService);

  /**
   * Hook de ciclo de vida de Angular.
   * Ejecuta la carga inicial de tareas y categorías.
   */
  ngOnInit() {
    this.loadTasks();
    this.loadCategories();
  }

  /**
   * Carga todas las tareas desde el backend.
   * Actualiza el estado de loading y aplica filtros automáticamente.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Recargar tareas después de una acción
   * this.loadTasks();
   * ```
   */
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

  /**
   * Carga todas las categorías disponibles desde el backend.
   *
   * @returns {void}
   * @private
   */
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  /**
   * Filtra las tareas por estado.
   * Actualiza el filtro seleccionado y reaplica todos los filtros.
   *
   * @param {Event} event - Evento del select de filtro
   * @returns {void}
   *
   * @example
   * ```html
   * <select (change)="filterByStatus($event)">
   *   <option value="">Todos</option>
   *   <option value="pending">Pendientes</option>
   * </select>
   * ```
   */
  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.selectedStatus.set(status);
    this.applyFilters();
  }

  /**
   * Filtra las tareas por categoría.
   * Actualiza el filtro seleccionado y reaplica todos los filtros.
   *
   * @param {Event} event - Evento del select de filtro
   * @returns {void}
   *
   * @example
   * ```html
   * <select (change)="filterByCategory($event)">
   *   <option value="">Todas</option>
   *   <option *ngFor="let cat of categories()" [value]="cat.id">
   *     {{cat.name}}
   *   </option>
   * </select>
   * ```
   */
  filterByCategory(event: Event) {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  /**
   * Aplica todos los filtros activos a la lista de tareas.
   * Combina filtros de estado y categoría.
   *
   * @returns {void}
   * @private
   */
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

  /**
   * Obtiene el nombre de una categoría por su ID.
   *
   * @param {string} categoryId - ID de la categoría
   * @returns {string} Nombre de la categoría o 'Sin categoría' si no existe
   *
   * @example
   * ```html
   * <span>{{ getCategoryName(task.categoryId) }}</span>
   * ```
   */
  getCategoryName(categoryId: string): string {
    const category = this.categories().find(c => c.id === categoryId);
    return category?.name || 'Sin categoría';
  }

  /**
   * Obtiene la etiqueta en español de un estado de tarea.
   *
   * @param {TaskStatus} status - Estado de la tarea
   * @returns {string} Etiqueta traducida del estado
   *
   * @example
   * ```html
   * <span class="status">{{ getStatusLabel(task.status) }}</span>
   * ```
   */
  getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      [TaskStatus.PENDING]: 'Pendiente',
      [TaskStatus.IN_PROGRESS]: 'En Progreso',
      [TaskStatus.COMPLETED]: 'Completada',
      [TaskStatus.CANCELLED]: 'Cancelada'
    };
    return labels[status];
  }

  /**
   * Marca una tarea como completada.
   * Recarga la lista de tareas después de completar.
   *
   * @param {string} taskId - ID de la tarea a completar
   * @returns {void}
   *
   * @example
   * ```html
   * <button (click)="completeTask(task.id)">Completar</button>
   * ```
   */
  completeTask(taskId: string) {
    this.taskService.completeTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (error) => console.error('Error completing task:', error)
    });
  }

  /**
   * Navega al formulario de edición de una tarea.
   * TODO: Implementar navegación al formulario de edición.
   *
   * @param {string} taskId - ID de la tarea a editar
   * @returns {void}
   */
  editTask(taskId: string) {
    // TODO: Navigate to edit form
    console.log('Edit task:', taskId);
  }

  /**
   * Elimina una tarea después de confirmación del usuario.
   * Recarga la lista de tareas después de eliminar.
   *
   * @param {string} taskId - ID de la tarea a eliminar
   * @returns {void}
   *
   * @example
   * ```html
   * <button (click)="deleteTask(task.id)" class="btn-delete">
   *   Eliminar
   * </button>
   * ```
   */
  deleteTask(taskId: string) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }

  /**
   * Cierra el menú de navegación si está abierto.
   *
   * @returns {void}
   */
  cerrarMenu() {
    this.uiState.closeMenu();
  }
}
