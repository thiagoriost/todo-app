import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Category, CreateCategoryDto } from '../models';

/**
 * Servicio para gestionar las categorías de tareas con localStorage.
 * Proporciona operaciones CRUD completas para categorías,
 * permitiendo organizar y clasificar las tareas del sistema.
 *
 * @class CategoryService
 * @injectable
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * constructor(private categoryService: CategoryService) {}
 *
 * loadCategories() {
 *   this.categoryService.getCategories().subscribe(
 *     categories => console.log(categories)
 *   );
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  /** Clave para almacenar categorías en localStorage */
  private readonly STORAGE_KEY = 'todoapp_categories';

  /** Clave para contador de IDs */
  private readonly COUNTER_KEY = 'todoapp_categories_counter';

  constructor() {
    // Inicializar con categorías por defecto si no existen
    this.initializeDefaultCategories();
  }

  /**
   * Inicializa categorías por defecto si no hay ninguna
   * @private
   */
  private initializeDefaultCategories(): void {
    const categories = this.loadCategories();
    if (categories.length === 0) {
      const defaults: Category[] = [
        {
          id: 'cat-1',
          name: 'Personal',
          color: '#4caf50',
          icon: '👤',
          taskCount: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat-2',
          name: 'Trabajo',
          color: '#2196f3',
          icon: '💼',
          taskCount: 0,
          createdAt: new Date().toISOString()
        },
        {
          id: 'cat-3',
          name: 'Urgente',
          color: '#f44336',
          icon: '⚡',
          taskCount: 0,
          createdAt: new Date().toISOString()
        }
      ];
      this.saveCategories(defaults);
      this.setCounter(4);
    }
  }

  /**
   * Carga categorías desde localStorage
   * @private
   */
  private loadCategories(): Category[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda categorías en localStorage
   * @private
   */
  private saveCategories(categories: Category[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
  }

  /**
   * Genera un nuevo ID único para categorías
   * @private
   */
  private generateId(): string {
    const counter = this.getCounter();
    this.setCounter(counter + 1);
    return `cat-${counter}`;
  }

  /**
   * Obtiene el contador actual de IDs
   * @private
   */
  private getCounter(): number {
    const counter = localStorage.getItem(this.COUNTER_KEY);
    return counter ? parseInt(counter, 10) : 1;
  }

  /**
   * Establece el valor del contador de IDs
   * @private
   */
  private setCounter(value: number): void {
    localStorage.setItem(this.COUNTER_KEY, value.toString());
  }

  /**
   * Actualiza el contador de tareas para cada categoría
   * @private
   */
  private updateTaskCounts(): void {
    const categories = this.loadCategories();
    const tasks = JSON.parse(localStorage.getItem('todoapp_tasks') || '[]');

    categories.forEach(category => {
      category.taskCount = tasks.filter((t: any) => t.categoryId === category.id).length;
    });

    this.saveCategories(categories);
  }

  /**
   * Obtiene todas las categorías disponibles desde localStorage.
   * Incluye el conteo de tareas asociadas a cada categoría.
   *
   * @returns {Observable<Category[]>} Observable con array de categorías
   *
   * @example
   * ```typescript
   * this.categoryService.getCategories().subscribe({
   *   next: (categories) => {
   *     categories.forEach(cat => {
   *       console.log(`${cat.name}: ${cat.taskCount} tareas`);
   *     });
   *   },
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  getCategories(): Observable<Category[]> {
    this.updateTaskCounts();
    const categories = this.loadCategories();
    return of(categories);
  }

  /**
   * Obtiene una categoría específica por su ID desde localStorage.
   *
   * @param {string} id - Identificador único de la categoría
   * @returns {Observable<Category>} Observable con la categoría encontrada
   * @throws Error si la categoría no existe
   *
   * @example
   * ```typescript
   * this.categoryService.getCategoryById('cat-123').subscribe(
   *   category => console.log('Categoría:', category.name)
   * );
   * ```
   */
  getCategoryById(id: string): Observable<Category> {
    const categories = this.loadCategories();
    const category = categories.find(c => c.id === id);
    return category ? of(category) : throwError(() => new Error(`Categoría ${id} no encontrada`));
  }

  /**
   * Crea una nueva categoría en localStorage.
   *
   * @param {CreateCategoryDto} category - Datos de la categoría a crear
   * @returns {Observable<Category>} Observable con la categoría creada
   * @throws Error si el nombre ya existe
   *
   * @example
   * ```typescript
   * const newCategory: CreateCategoryDto = {
   *   name: 'Trabajo',
   *   color: '#2196f3',
   *   icon: '💼',
   *   description: 'Tareas laborales'
   * };
   * this.categoryService.createCategory(newCategory).subscribe(
   *   category => console.log('Creada:', category.id)
   * );
   * ```
   */
  createCategory(category: CreateCategoryDto): Observable<Category> {
    const categories = this.loadCategories();

    // Verificar que no exista otra categoría con el mismo nombre
    if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
      return throwError(() => new Error(`Ya existe una categoría con el nombre "${category.name}"`));
    }

    const newCategory: Category = {
      id: this.generateId(),
      ...category,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };

    categories.push(newCategory);
    this.saveCategories(categories);

    return of(newCategory);
  }

  /**
   * Actualiza una categoría existente en localStorage.
   * Permite actualización parcial de campos.
   *
   * @param {string} id - ID de la categoría a actualizar
   * @param {Partial<CreateCategoryDto>} category - Campos a actualizar
   * @returns {Observable<Category>} Observable con la categoría actualizada
   * @throws Error si la categoría no existe
   *
   * @example
   * ```typescript
   * const updates: Partial<CreateCategoryDto> = {
   *   color: '#4caf50',
   *   description: 'Nueva descripción'
   * };
   * this.categoryService.updateCategory('cat-123', updates).subscribe(
   *   category => console.log('Actualizada:', category)
   * );
   * ```
   */
  updateCategory(id: string, category: Partial<CreateCategoryDto>): Observable<Category> {
    const categories = this.loadCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Categoría ${id} no encontrada`));
    }

    // Verificar nombre duplicado si se está cambiando el nombre
    if (category.name) {
      const duplicate = categories.find(c =>
        c.id !== id && c.name.toLowerCase() === category.name!.toLowerCase()
      );
      if (duplicate) {
        return throwError(() => new Error(`Ya existe una categoría con el nombre "${category.name}"`));
      }
    }

    categories[index] = {
      ...categories[index],
      ...category,
      id // Mantener el ID original
    };

    this.saveCategories(categories);
    return of(categories[index]);
  }

  /**
   * Elimina una categoría del sistema (localStorage).
   * ADVERTENCIA: Esta operación puede afectar las tareas asociadas.
   *
   * @param {string} id - ID de la categoría a eliminar
   * @returns {Observable<void>} Observable que completa cuando se elimina
   * @throws Error si la categoría no existe o tiene tareas asociadas
   *
   * @example
   * ```typescript
   * if (confirm('¿Eliminar categoría y sus tareas?')) {
   *   this.categoryService.deleteCategory('cat-123').subscribe({
   *     next: () => console.log('Eliminada'),
   *     error: (err) => console.error('No se puede eliminar:', err)
   *   });
   * }
   * ```
   */
  deleteCategory(id: string): Observable<void> {
    const categories = this.loadCategories();
    const index = categories.findIndex(c => c.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Categoría ${id} no encontrada`));
    }

    // Verificar si tiene tareas asociadas
    const tasks = JSON.parse(localStorage.getItem('todoapp_tasks') || '[]');
    const hasTask = tasks.some((t: any) => t.categoryId === id);

    if (hasTask) {
      return throwError(() => new Error('No se puede eliminar una categoría que tiene tareas asociadas'));
    }

    categories.splice(index, 1);
    this.saveCategories(categories);

    return of(void 0);
  }
}
