import { Routes } from '@angular/router';

/**
 * Configuración de rutas de la aplicación.
 * Define todas las rutas disponibles con lazy loading para mejor rendimiento.
 *
 * @constant {Routes} routes
 *
 * @description
 * Rutas configuradas:
 * - '/' -> Redirige a /tasks
 * - '/tasks' -> Listado de tareas (lazy loaded)
 * - '/tasks/new' -> Formulario nueva tarea (lazy loaded)
 * - '/history' -> Historial de cambios (lazy loaded)
 * - '/categories' -> Gestión de categorías (lazy loaded)
 * - '/**' -> Cualquier ruta no definida redirige a /tasks
 *
 * @example
 * ```typescript
 * // Uso en app.config.ts
 * import { routes } from './app.routes';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes)
 *   ]
 * };
 * ```
 *
 * @remarks
 * Todas las rutas utilizan lazy loading (loadComponent) para:
 * - Reducir el tamaño del bundle inicial
 * - Mejorar el tiempo de carga inicial
 * - Cargar componentes solo cuando se necesitan
 */
export const routes: Routes = [
  /**
   * Ruta raíz - Redirige a la lista de tareas.
   * @route /
   */
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  /**
   * Ruta de listado de tareas.
   * Muestra todas las tareas con opciones de filtrado.
   * @route /tasks
   */
  {
    path: 'tasks',
    loadComponent: () => import('./features/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  /**
   * Ruta de creación de tarea.
   * Formulario para crear una nueva tarea.
   * @route /tasks/new
   */
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  /**
   * Ruta de historial.
   * Muestra el historial de cambios en formato timeline.
   * @route /history
   */
  {
    path: 'history',
    loadComponent: () => import('./features/task-history/task-history.component').then(m => m.TaskHistoryComponent)
  },
  /**
   * Ruta de categorías.
   * Gestión de categorías (crear, editar, eliminar).
   * @route /categories
   */
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  /**
   * Ruta wildcard - Captura cualquier ruta no definida.
   * Redirige a la lista de tareas.
   * @route /**
   */
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
