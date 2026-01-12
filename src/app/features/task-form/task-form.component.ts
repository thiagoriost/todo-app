import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { Category, TaskPriority, CreateTaskDto } from '../../core/models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form-container">
      <h2>Nueva Tarea</h2>

      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Título *</label>
          <input
            id="title"
            type="text"
            formControlName="title"
            placeholder="Ingrese el título de la tarea"
          />
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
            <span class="error">El título es requerido</span>
          }
        </div>

        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            formControlName="description"
            rows="4"
            placeholder="Descripción detallada (opcional)"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categoryId">Categoría *</label>
            <select id="categoryId" formControlName="categoryId">
              <option value="">Seleccione una categoría</option>
              @for (category of categories(); track category.id) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
            @if (taskForm.get('categoryId')?.invalid && taskForm.get('categoryId')?.touched) {
              <span class="error">La categoría es requerida</span>
            }
          </div>

          <div class="form-group">
            <label for="priority">Prioridad *</label>
            <select id="priority" formControlName="priority">
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="dueDate">Fecha de vencimiento</label>
          <input
            id="dueDate"
            type="date"
            formControlName="dueDate"
          />
        </div>

        <div class="form-group">
          <label for="tags">Etiquetas (separadas por comas)</label>
          <input
            id="tags"
            type="text"
            formControlName="tagsInput"
            placeholder="ej: trabajo, urgente, cliente"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" [disabled]="taskForm.invalid || submitting()">
            {{ submitting() ? 'Guardando...' : 'Crear Tarea' }}
          </button>
          <button type="button" class="btn-cancel" (click)="onCancel()">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .task-form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h2 {
      margin-bottom: 24px;
      color: #333;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #555;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #2196f3;
    }

    .error {
      display: block;
      margin-top: 4px;
      color: #f44336;
      font-size: 12px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .form-actions button {
      flex: 1;
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-submit {
      background: #4caf50;
      color: white;
    }

    .btn-submit:hover:not(:disabled) {
      background: #45a049;
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-cancel {
      background: #f5f5f5;
      color: #666;
    }

    .btn-cancel:hover {
      background: #e0e0e0;
    }
  `]
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  submitting = signal(false);

  taskForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    categoryId: ['', Validators.required],
    priority: ['medium', Validators.required],
    dueDate: [''],
    tagsInput: ['']
  });

  constructor() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: (error) => console.error('Error loading categories:', error)
    });
  }

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

  onCancel() {
    this.taskForm.reset({ priority: 'medium' });
    // TODO: Navigate back
  }
}
