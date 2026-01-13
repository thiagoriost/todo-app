import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { Category, CreateCategoryDto } from '../../core/models';
import { UiStateService } from '../../core/services/ui-state.service';

/**
 * Componente para gestionar categorías de tareas.
 * Permite crear, visualizar, editar y eliminar categorías,
 * mostrando el número de tareas asociadas a cada una.
 *
 * @class CategoriesComponent
 * @implements {OnInit}
 *
 * @example
 * ```html
 * <app-categories></app-categories>
 * ```
 *
 * @description
 * Funcionalidades:
 * - Listado de todas las categorías con diseño de tarjetas
 * - Formulario para crear nuevas categorías
 * - Selección de color personalizado
 * - Selección de icono/emoji
 * - Contador de tareas por categoría
 * - Edición y eliminación de categorías
 * - Diseño responsive mobile-first
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  /** FormBuilder inyectado */
  private fb = inject(FormBuilder);

  /** Servicio de categorías inyectado */
  private categoryService = inject(CategoryService);

  /** Señal reactiva con todas las categorías */
  categories = signal<Category[]>([]);

  /** Señal que indica si se están cargando las categorías */
  loading = signal(true);

  /** Señal que controla la visibilidad del formulario de creación */
  showForm = signal(false);

  /** Servicio de estado de UI inyectado */
  uiState = inject(UiStateService);

  /**
   * Formulario reactivo para crear/editar categorías.
   *
   * @type {FormGroup}
   *
   * Campos:
   * - name: Nombre de la categoría (requerido)
   * - color: Color hexadecimal (requerido, default: #2196f3)
   * - icon: Emoji o ícono (opcional, default: 📁)
   * - description: Descripción de la categoría (opcional)
   */
  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    color: ['#2196f3', Validators.required],
    icon: ['📁'],
    description: ['']
  });

  /**
   * Hook de ciclo de vida de Angular.
   * Carga las categorías al inicializar el componente.
   */
  ngOnInit() {
    this.loadCategories();
  }

  /**
   * Carga todas las categorías desde el backend.
   * Actualiza el estado de loading durante la carga.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Recargar categorías después de crear una nueva
   * this.loadCategories();
   * ```
   */
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

  /**
   * Alterna la visibilidad del formulario de creación.
   * Resetea el formulario al ocultar.
   *
   * @returns {void}
   *
   * @example
   * ```html
   * <button (click)="toggleForm()" class="btn-new">
   *   {{ showForm() ? 'Cancelar' : 'Nueva Categoría' }}
   * </button>
   * ```
   */
  toggleForm() {
    this.showForm.update(value => !value);
    if (!this.showForm()) {
      this.categoryForm.reset({ color: '#2196f3', icon: '📁' });
    }
  }

  /**
   * Maneja el envío del formulario de creación.
   * Crea una nueva categoría y recarga la lista.
   *
   * @returns {void}
   *
   * @description
   * Proceso:
   * 1. Valida el formulario
   * 2. Envía datos al backend
   * 3. Recarga categorías
   * 4. Oculta el formulario
   *
   * @example
   * ```html
   * <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
   *   <!-- campos del formulario -->
   *   <button type="submit" [disabled]="!categoryForm.valid">
   *     Crear
   *   </button>
   * </form>
   * ```
   */
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

  /**
   * Inicia el proceso de edición de una categoría.
   * TODO: Implementar lógica de edición completa.
   *
   * @param {Category} category - Categoría a editar
   * @returns {void}
   *
   * @example
   * ```html
   * <button (click)="editCategory(category)">
   *   ✏️ Editar
   * </button>
   * ```
   */
  editCategory(category: Category) {
    // TODO: Implement edit
    console.log('Edit category:', category);
  }

  /**
   * Elimina una categoría después de confirmación.
   * Recarga la lista de categorías al completar.
   *
   * @param {string} id - ID de la categoría a eliminar
   * @returns {void}
   *
   * @warning
   * La eliminación puede fallar si hay tareas asociadas.
   *
   * @example
   * ```html
   * <button (click)="deleteCategory(category.id)" class="btn-delete">
   *   🗑️ Eliminar
   * </button>
   * ```
   */
  deleteCategory(id: string) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error)
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
