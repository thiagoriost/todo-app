/**
 * Configuración de entorno para desarrollo.
 * Define variables de entorno específicas para el ambiente de desarrollo.
 *
 * @constant {Object} environment
 * @property {boolean} production - Indica si es ambiente de producción (false para desarrollo)
 * @property {string} apiUrl - URL base del API backend para desarrollo
 *
 * @description
 * Este archivo se utiliza durante el desarrollo local.
 * El servidor de desarrollo apunta a localhost:3000.
 *
 * Para producción, se utiliza environment.prod.ts
 *
 * @example
 * ```typescript
 * // Uso en servicios
 * import { environment } from '../../../environments/environment';
 *
 * const apiUrl = `${environment.apiUrl}/tasks`;
 * // En desarrollo: http://localhost:3000/api/tasks
 * ```
 *
 * @see {@link environment.prod.ts} Para configuración de producción
 */
export const environment = {
  /** Indica si es entorno de producción */
  production: false,

  /** URL base del API backend (desarrollo local) */
  apiUrl: 'http://localhost:3000/api'
};
