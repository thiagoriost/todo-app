import { Component, inject } from '@angular/core';
import { RouterOutlet, Router} from '@angular/router';
import { UiStateService } from './core/services/ui-state.service';

/**
 * Componente raíz de la aplicación ToDoApp.
 * Maneja la navegación principal y estructura base de la aplicación.
 *
 * @class App
 *
 * @description
 * Este componente proporciona:
 * - Navegación programática mediante métodos
 * - Estructura principal (header, main, footer)
 * - Detección de ruta activa
 * - Diseño responsive mobile-first
 * - Menú hamburguesa colapsable para móviles
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Título de la aplicación */
  protected title = 'todo-app';

  /** Router inyectado para navegación programática */
  private router = inject(Router);

  /** Servicio de estado de UI centralizado */
  protected uiState = inject(UiStateService);

  /**
   * Alterna la visibilidad del menú de navegación.
   * Usado principalmente en dispositivos móviles con menú hamburguesa.
   *
   * @example
   * ```html
   * <button (click)="toggleMenu()">☰</button>
   * ```
   */
  toggleMenu(): void {
    this.uiState.toggleMenu();
  }

  /**
   * Navega a la página de listado de tareas.
   * Muestra todas las tareas con opciones de filtrado.
   * Cierra el menú móvil tras la navegación.
   *
   * @returns {Promise<boolean>} Promesa que indica si la navegación fue exitosa
   *
   * @example
   * ```html
   * <a (click)="navigateToTasks()">Tareas</a>
   * ```
   */
  navigateToTasks(): Promise<boolean> {
    this.uiState.closeMenu();
    return this.router.navigate(['/tasks']);
  }

  /**
   * Navega al formulario de creación de nueva tarea.
   * Cierra el menú móvil tras la navegación.
   *
   * @returns {Promise<boolean>} Promesa que indica si la navegación fue exitosa
   *
   * @example
   * ```html
   * <a (click)="navigateToNewTask()">Nueva Tarea</a>
   * ```
   */
  navigateToNewTask(): Promise<boolean> {
    this.uiState.closeMenu();
    return this.router.navigate(['/tasks/new']);
  }

  /**
   * Navega a la página de gestión de categorías.
   * Permite crear, editar y eliminar categorías.
   * Cierra el menú móvil tras la navegación.
   *
   * @returns {Promise<boolean>} Promesa que indica si la navegación fue exitosa
   *
   * @example
   * ```html
   * <a (click)="navigateToCategories()">Categorías</a>
   * ```
   */
  navigateToCategories(): Promise<boolean> {
    this.uiState.closeMenu();
    return this.router.navigate(['/categories']);
  }

  /**
   * Navega a la página de historial de cambios.
   * Muestra el timeline de todas las acciones realizadas en las tareas.
   * Cierra el menú móvil tras la navegación.
   *
   * @returns {Promise<boolean>} Promesa que indica si la navegación fue exitosa
   *
   * @example
   * ```html
   * <a (click)="navigateToHistory()">Historial</a>
   * ```
   */
  navigateToHistory(): Promise<boolean> {
    this.uiState.closeMenu();
    return this.router.navigate(['/history']);
  }

  /**
   * Verifica si una ruta está activa actualmente.
   * Útil para aplicar estilos CSS a enlaces activos.
   *
   * @param {string} route - Ruta a verificar (ej: '/tasks', '/categories')
   * @returns {boolean} true si la ruta está activa, false en caso contrario
   *
   * @example
   * ```html
   * <a [class.active]="isRouteActive('/tasks')">
   *   Tareas
   * </a>
   * ```
   */
  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}
