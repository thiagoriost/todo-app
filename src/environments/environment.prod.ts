/**
 * Configuración de entorno para producción.
 * Define variables de entorno específicas para el ambiente de producción.
 *
 * @constant {Object} environment
 * @property {boolean} production - Indica si es ambiente de producción (true)
 * @property {string} apiUrl - URL base del API backend para producción
 *
 * @description
 * Este archivo se utiliza durante el build de producción.
 * El servidor de producción debe apuntar a la URL real del API.
 *
 * IMPORTANTE: Actualizar apiUrl con la URL real del servidor de producción.
 *
 * @example
 * ```typescript
 * // Durante el build de producción, este archivo reemplaza a environment.ts
 * // ng build --configuration production
 *
 * import { environment } from '../../../environments/environment';
 * const apiUrl = `${environment.apiUrl}/tasks`;
 * // En producción: https://api.yourapp.com/api/tasks
 * ```
 *
 * @see {@link environment.ts} Para configuración de desarrollo
 *
 * @remarks
 * Asegúrese de configurar CORS en el servidor backend
 * para permitir peticiones desde el dominio de producción.
 */
export const environment = {
  /** Indica que es entorno de producción */
  production: true,

  /** URL base del API backend (ACTUALIZAR CON URL REAL) */
  apiUrl: 'https://api.yourapp.com/api'
};
