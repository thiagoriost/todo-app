import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category, CreateCategoryDto } from '../../core/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="categories-container">
      <div class="header">
        <h2>Categorías</h2>
        <button (click)="toggleForm()" class="btn-new">
          {{ showForm() ? 'Cancelar' : '+ Nueva Categoría' }}
        </button>
      </div>

      @if (showForm()) {
        <div class="category-form">
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <input
                type="text"
                formControlName="name"
                placeholder="Nombre de la categoría"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <input
                  type="color"
                  formControlName="color"
                  title="Color"
                />
              </div>

              <div class="form-group">
                <input
                  type="text"
                  formControlName="icon"
                  placeholder="Icono (emoji o nombre)"
                />
              </div>
            </div>

            <div class="form-group">
              <input
                type="text"
                formControlName="description"
                placeholder="Descripción (opcional)"
              />
            </div>

            <button type="submit" class="btn-submit" [disabled]="categoryForm.invalid">
              Guardar
            </button>
          </form>
        </div>
      }

      <div class="categories-grid">
        @if (loading()) {
          <div class="loading">Cargando categorías...</div>
        } @else if (categories().length === 0) {
          <div class="empty">No hay categorías disponibles</div>
        } @else {
          @for (category of categories(); track category.id) {
            <div class="category-card" [style.border-left-color]="category.color">
              <div class="category-header">
                @if (category.icon) {
                  <span class="category-icon">{{ category.icon }}</span>
                }
                <h3>{{ category.name }}</h3>
              </div>

              @if (category.description) {
                <p class="description">{{ category.description }}</p>
              }

              <div class="category-footer">
                <span class="task-count">
                  {{ category.taskCount || 0 }} tareas
                </span>
                <div class="actions">
                  <button (click)="editCategory(category)" class="btn-icon">✏️</button>
                  <button (click)="deleteCategory(category.id)" class="btn-icon">🗑️</button>
                </div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .btn-new {
      padding: 10px 20px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .category-form {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 100px 1fr;
      gap: 12px;
    }

    input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    input[type="color"] {
      height: 44px;
      padding: 2px;
    }

    .btn-submit {
      width: 100%;
      padding: 12px;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 12px;
    }

    .btn-submit:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .category-card {
      background: white;
      border-radius: 8px;
      padding: 16px;
      border-left: 4px solid;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .category-icon {
      font-size: 24px;
    }

    .category-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .description {
      color: #666;
      font-size: 14px;
      margin: 8px 0;
    }

    .category-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #f0f0f0;
    }

    .task-count {
      color: #999;
      font-size: 14px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      padding: 4px;
    }

    .loading, .empty {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  showForm = signal(false);

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    color: ['#2196f3', Validators.required],
    icon: ['📁'],
    description: ['']
  });

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }

  toggleForm() {
    this.showForm.update(value => !value);
    if (!this.showForm()) {
      this.categoryForm.reset({ color: '#2196f3', icon: '📁' });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const categoryData: CreateCategoryDto = this.categoryForm.value;

      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.toggleForm();
        },
        error: (error) => console.error('Error creating category:', error)
      });
    }
  }

  editCategory(category: Category) {
    // TODO: Implement edit
    console.log('Edit category:', category);
  }

  deleteCategory(id: string) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
      });
    }
  }
}
