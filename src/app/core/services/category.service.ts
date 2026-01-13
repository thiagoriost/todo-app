import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto } from '../models';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar las categorías de tareas.
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
  /** Cliente HTTP para peticiones al backend */
  private http = inject(HttpClient);

  /** URL base del API de categorías */
  private apiUrl = `${environment.apiUrl}/categories`;

  /**
   * Obtiene todas las categorías disponibles.
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
    return this.http.get<Category[]>(this.apiUrl);
  }

  /**
   * Obtiene una categoría específica por su ID.
   *
   * @param {string} id - Identificador único de la categoría
   * @returns {Observable<Category>} Observable con la categoría encontrada
   * @throws {HttpErrorResponse} Si la categoría no existe (404)
   *
   * @example
   * ```typescript
   * this.categoryService.getCategoryById('cat-123').subscribe(
   *   category => console.log('Categoría:', category.name)
   * );
   * ```
   */
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea una nueva categoría en el sistema.
   *
   * @param {CreateCategoryDto} category - Datos de la categoría a crear
   * @returns {Observable<Category>} Observable con la categoría creada
   * @throws {HttpErrorResponse} Si la validación falla (400) o el nombre ya existe (409)
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
    return this.http.post<Category>(this.apiUrl, category);
  }

  /**
   * Actualiza una categoría existente.
   * Permite actualización parcial de campos.
   *
   * @param {string} id - ID de la categoría a actualizar
   * @param {Partial<CreateCategoryDto>} category - Campos a actualizar
   * @returns {Observable<Category>} Observable con la categoría actualizada
   * @throws {HttpErrorResponse} Si la categoría no existe (404)
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
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  /**
   * Elimina una categoría del sistema.
   * ADVERTENCIA: Esta operación puede afectar las tareas asociadas.
   *
   * @param {string} id - ID de la categoría a eliminar
   * @returns {Observable<void>} Observable que completa cuando se elimina
   * @throws {HttpErrorResponse} Si la categoría no existe (404) o tiene tareas asociadas (409)
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
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
