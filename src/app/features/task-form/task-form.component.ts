import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, TaskPriority, CreateTaskDto } from '../../core/models';

/**
 * Componente de formulario para crear nuevas tareas.
 * Proporciona un formulario reactivo con validación completa
 * para la creación de tareas en el sistema.
 *
 * @class TaskFormComponent
 *
 * @example
 * ```html
 * <!-- Uso en routing -->
 * <app-task-form></app-task-form>
 * ```
 *
 * @description
 * Características del formulario:
 * - Validación de campos requeridos
 * - Selección de categoría
 * - Selección de prioridad
 * - Fecha límite opcional
 * - Etiquetas (tags) separadas por comas
 * - Diseño responsive mobile-first
 * - Feedback visual durante envío
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  /** FormBuilder inyectado para crear formularios reactivos */
  private fb = inject(FormBuilder);

  /** Servicio de tareas inyectado */
  private taskService = inject(TaskService);

  /** Servicio de categorías inyectado */
  private categoryService = inject(CategoryService);

  /** Señal reactiva con categorías disponibles para selección */
  categories = signal<Category[]>([]);

  /** Señal que indica si el formulario se está enviando */
  submitting = signal(false);

  /**
   * Formulario reactivo para crear tareas.
   *
   * @type {FormGroup}
   *
   * Campos del formulario:
   * - title: Título de la tarea (requerido)
   * - description: Descripción detallada (opcional)
   * - categoryId: ID de categoría (requerido)
   * - priority: Nivel de prioridad (requerido, default: 'medium')
   * - dueDate: Fecha límite (opcional)
   * - tagsInput: Etiquetas separadas por comas (opcional)
   */
  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: [''],
    tagsInput: ['']
  });

  /**
   * Constructor del componente.
   * Inicializa la carga de categorías.
   */
  constructor() {
    this.loadCategories();
  }

  /**
   * Carga todas las categorías disponibles desde el backend.
   * Necesario para el selector de categorías del formulario.
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
   * Maneja el envío del formulario.
   * Valida, procesa los datos y crea la tarea en el backend.
   *
   * @returns {void}
   *
   * @description
   * Proceso de envío:
   * 1. Valida que el formulario sea válido
   * 2. Procesa las etiquetas (separa por comas)
   * 3. Construye el DTO de creación
   * 4. Envía al backend
   * 5. Resetea el formulario en caso de éxito
   *
   * @example
   * ```html
   * <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
   *   <!-- campos del formulario -->
   *   <button type="submit" [disabled]="!taskForm.valid || submitting()">
   *     Crear Tarea
   *   </button>
   * </form>
   * ```
   */
  onSubmit() {
    if (this.taskForm.valid) {
      this.submitting.set(true);

      const formValue = this.taskForm.value;
      const tags = formValue.tagsInput
        ? formValue.tagsInput.split(',').map((tag: string) => tag.trim())
        : [];

      const taskData: CreateTaskDto = {
        title: formValue.title,
        description: formValue.description || undefined,
        categoryId: formValue.categoryId,
        priority: formValue.priority as TaskPriority,
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        tags: tags.length > 0 ? tags : undefined
      };

      this.taskService.createTask(taskData).subscribe({
        next: (task) => {
          console.log('Task created:', task);
          this.taskForm.reset({ priority: 'medium' });
          this.submitting.set(false);
          // TODO: Navigate to task list or show success message
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.submitting.set(false);
        }
      });
    }
  }

  /**
   * Cancela la creación de la tarea y resetea el formulario.
   * TODO: Implementar navegación de regreso.
   *
   * @returns {void}
   *
   * @example
   * ```html
   * <button type="button" (click)="onCancel()" class="btn-cancel">
   *   Cancelar
   * </button>
   * ```
   */
  onCancel() {
    this.taskForm.reset({ priority: 'medium' });
    // TODO: Navigate back
  }
}
