/**
 * Interfaz que representa una categoría de tareas.
 * Las categorías permiten organizar y agrupar tareas relacionadas.
 *
 * @interface Category
 * @property {string} id - Identificador único de la categoría
 * @property {string} name - Nombre descriptivo de la categoría
 * @property {string} color - Color hexadecimal para identificación visual (ej: #2196f3)
 * @property {string} [icon] - Emoji o ícono representativo opcional
 * @property {string} [description] - Descripción detallada de la categoría
 * @property {Date} createdAt - Fecha de creación de la categoría
 * @property {number} [taskCount] - Cantidad de tareas asociadas (calculado)
 *
 * @example
 * ```typescript
 * const category: Category = {
 *   id: '123',
 *   name: 'Trabajo',
 *   color: '#2196f3',
 *   icon: '💼',
 *   createdAt: new Date(),
 *   taskCount: 5
 * };
 * ```
 */
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  description?: string;
  createdAt: Date;
  taskCount?: number;
}

/**
 * DTO (Data Transfer Object) para crear una nueva categoría.
 * Contiene los campos necesarios para crear una categoría.
 *
 * @interface CreateCategoryDto
 * @property {string} name - Nombre de la categoría (requerido)
 * @property {string} color - Color hexadecimal (requerido, ej: #2196f3)
 * @property {string} [icon] - Emoji o ícono opcional
 * @property {string} [description] - Descripción opcional
 *
 * @example
 * ```typescript
 * const newCategory: CreateCategoryDto = {
 *   name: 'Personal',
 *   color: '#4caf50',
 *   icon: '🏠',
 *   description: 'Tareas personales y del hogar'
 * };
 * ```
 */
export interface CreateCategoryDto {
  name: string;
  color: string;
  icon?: string;
  description?: string;
}
