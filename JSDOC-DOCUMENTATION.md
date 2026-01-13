# 📚 Documentación JSDoc - ToDoApp

Este documento describe la estructura completa de documentación JSDoc implementada en el proyecto ToDoApp.

## 📋 Índice

- [Visión General](#visión-general)
- [Estructura de Documentación](#estructura-de-documentación)
- [Modelos](#modelos)
- [Servicios](#servicios)
- [Componentes](#componentes)
- [Configuración](#configuración)
- [Generar Documentación](#generar-documentación)
- [Convenciones](#convenciones)

## 🎯 Visión General

Toda la base de código TypeScript está documentada usando JSDoc, siguiendo las mejores prácticas de documentación para proyectos Angular. La documentación incluye:

- **Descripciones detalladas** de clases, interfaces, enums y funciones
- **Ejemplos de uso** prácticos
- **Tipos de parámetros** y valores de retorno
- **Advertencias** y notas importantes
- **Referencias cruzadas** entre componentes relacionados

## 🗂️ Estructura de Documentación

### Modelos (`src/app/core/models/`)

#### task.model.ts
Documenta:
- ✅ `TaskStatus` - Enum de estados de tarea
- ✅ `TaskPriority` - Enum de prioridades
- ✅ `Task` - Interfaz completa de tarea
- ✅ `CreateTaskDto` - DTO para creación
- ✅ `UpdateTaskDto` - DTO para actualización

**Ejemplo:**
```typescript
/**
 * Estado de una tarea en el sistema.
 * Define los diferentes estados del ciclo de vida de una tarea.
 * 
 * @enum {string}
 * @readonly
 */
export enum TaskStatus {
  /** Tarea pendiente de iniciar */
  PENDING = 'pending',
  // ...
}
```

#### category.model.ts
Documenta:
- ✅ `Category` - Interfaz de categoría
- ✅ `CreateCategoryDto` - DTO para creación de categoría

#### task-history.model.ts
Documenta:
- ✅ `HistoryAction` - Enum de acciones
- ✅ `TaskHistory` - Interfaz de historial
- ✅ `TaskHistoryFilter` - Filtros de búsqueda

#### index.ts
Archivo barril documentado con todas las exportaciones

### Servicios (`src/app/core/services/`)

#### task.service.ts
Documenta métodos:
- ✅ `getTasks()` - Obtener todas las tareas
- ✅ `getTaskById(id)` - Obtener tarea por ID
- ✅ `getTasksByCategory(categoryId)` - Filtrar por categoría
- ✅ `getTasksByStatus(status)` - Filtrar por estado
- ✅ `createTask(task)` - Crear nueva tarea
- ✅ `updateTask(id, task)` - Actualizar tarea
- ✅ `deleteTask(id)` - Eliminar tarea
- ✅ `completeTask(id)` - Marcar como completada
- ✅ `searchTasks(query)` - Buscar tareas

**Ejemplo:**
```typescript
/**
 * Obtiene todas las tareas del sistema.
 * 
 * @returns {Observable<Task[]>} Observable con array de tareas
 * 
 * @example
 * ```typescript
 * this.taskService.getTasks().subscribe({
 *   next: (tasks) => console.log(tasks),
 *   error: (error) => console.error(error)
 * });
 * ```
 */
getTasks(): Observable<Task[]>
```

#### category.service.ts
Documenta métodos:
- ✅ `getCategories()` - Obtener categorías
- ✅ `getCategoryById(id)` - Obtener por ID
- ✅ `createCategory(category)` - Crear categoría
- ✅ `updateCategory(id, category)` - Actualizar
- ✅ `deleteCategory(id)` - Eliminar

#### task-history.service.ts
Documenta métodos:
- ✅ `getHistory(filter?)` - Obtener historial con filtros
- ✅ `getTaskHistory(taskId)` - Historial de una tarea
- ✅ `getRecentHistory(limit)` - Actividad reciente

### Componentes (`src/app/features/`)

#### task-list.component.ts
Documenta:
- ✅ Clase completa con descripción de funcionalidad
- ✅ Propiedades reactivas (signals)
- ✅ Métodos de carga y filtrado
- ✅ Métodos de acciones (completar, editar, eliminar)
- ✅ Utilidades de formato

**Ejemplo:**
```typescript
/**
 * Componente para listar y gestionar tareas.
 * Muestra todas las tareas con opciones de filtrado por estado y categoría,
 * y permite realizar acciones como completar, editar o eliminar tareas.
 * 
 * @class TaskListComponent
 * @implements {OnInit}
 */
```

#### task-form.component.ts
Documenta:
- ✅ Formulario reactivo completo
- ✅ Validaciones
- ✅ Procesamiento de datos
- ✅ Manejo de envío

#### categories.component.ts
Documenta:
- ✅ Gestión CRUD de categorías
- ✅ Toggle de formulario
- ✅ Validaciones y confirmaciones

#### task-history.component.ts
Documenta:
- ✅ Visualización de historial
- ✅ Filtros múltiples
- ✅ Formateo de fechas
- ✅ Procesamiento de cambios

### Configuración (`src/app/`)

#### app.config.ts
Documenta:
- ✅ Configuración de providers
- ✅ Service Worker setup
- ✅ HTTP client configuration
- ✅ Router setup

#### app.routes.ts
Documenta:
- ✅ Todas las rutas disponibles
- ✅ Lazy loading configuration
- ✅ Redirects y wildcards

#### Environments
- ✅ `environment.ts` - Configuración desarrollo
- ✅ `environment.prod.ts` - Configuración producción

## 🛠️ Generar Documentación

### Opción 1: TypeDoc (Recomendado)

```bash
# Instalar TypeDoc
npm install --save-dev typedoc

# Generar documentación HTML
npx typedoc --out docs src/app

# Abrir documentación
# Navegar a docs/index.html
```

### Opción 2: Compodoc (Específico para Angular)

```bash
# Instalar Compodoc
npm install --save-dev @compodoc/compodoc

# Generar documentación
npx compodoc -p tsconfig.json

# Servir documentación en navegador
npx compodoc -s
```

### Configuración TypeDoc (typedoc.json)

```json
{
  "entryPoints": ["src/app"],
  "out": "docs",
  "exclude": [
    "**/*.spec.ts",
    "**/node_modules/**"
  ],
  "name": "ToDoApp - Documentación API",
  "excludePrivate": false,
  "excludeProtected": false,
  "theme": "default"
}
```

## 📝 Convenciones de Documentación

### Para Interfaces y Types

```typescript
/**
 * Descripción breve de la interfaz.
 * Descripción más detallada si es necesaria.
 * 
 * @interface NombreInterfaz
 * @property {tipo} nombrePropiedad - Descripción de la propiedad
 * 
 * @example
 * ```typescript
 * const ejemplo: NombreInterfaz = {
 *   nombrePropiedad: 'valor'
 * };
 * ```
 */
```

### Para Clases

```typescript
/**
 * Descripción de la clase.
 * 
 * @class NombreClase
 * @implements {Interfaz} (si aplica)
 * 
 * @example
 * ```typescript
 * const instancia = new NombreClase();
 * ```
 */
```

### Para Métodos

```typescript
/**
 * Descripción del método.
 * 
 * @param {tipo} nombreParam - Descripción del parámetro
 * @returns {tipo} Descripción del valor de retorno
 * 
 * @example
 * ```typescript
 * const resultado = metodo(parametro);
 * ```
 * 
 * @throws {ErrorType} Cuándo se lanza (si aplica)
 */
```

### Para Enums

```typescript
/**
 * Descripción del enum.
 * 
 * @enum {tipo}
 * @readonly
 */
export enum NombreEnum {
  /** Descripción del valor 1 */
  VALOR1 = 'valor1',
  /** Descripción del valor 2 */
  VALOR2 = 'valor2'
}
```

### Para Componentes Angular

```typescript
/**
 * Descripción del componente.
 * 
 * @class NombreComponente
 * @implements {OnInit} (y otros lifecycle hooks)
 * 
 * @example
 * ```html
 * <app-nombre></app-nombre>
 * ```
 * 
 * @description
 * Características:
 * - Característica 1
 * - Característica 2
 */
```

## 🎨 Tags JSDoc Utilizados

| Tag | Uso | Ejemplo |
|-----|-----|---------|
| `@class` | Documenta clases | `@class TaskService` |
| `@interface` | Documenta interfaces | `@interface Task` |
| `@enum` | Documenta enums | `@enum {string}` |
| `@param` | Parámetros de función | `@param {string} id` |
| `@returns` | Valor de retorno | `@returns {Observable<Task>}` |
| `@property` | Propiedades de clase/interfaz | `@property {string} title` |
| `@example` | Ejemplos de uso | `@example ...` |
| `@description` | Descripción detallada | `@description ...` |
| `@throws` | Excepciones lanzadas | `@throws {HttpErrorResponse}` |
| `@see` | Referencias cruzadas | `@see TaskService` |
| `@readonly` | Marca como solo lectura | `@readonly` |
| `@private` | Marca como privado | `@private` |
| `@deprecated` | Marca como obsoleto | `@deprecated` |
| `@todo` | Tareas pendientes | `@todo Implementar` |

## 📊 Estadísticas de Documentación

### Archivos Documentados

- ✅ Modelos: 4/4 (100%)
- ✅ Servicios: 3/3 (100%)
- ✅ Componentes: 4/4 (100%)
- ✅ Configuración: 4/4 (100%)
- ✅ Total: 15/15 archivos (100%)

### Elementos Documentados

- **Interfaces**: 8
- **Enums**: 3
- **Clases (Servicios)**: 3
- **Clases (Componentes)**: 4
- **Métodos públicos**: ~50
- **Propiedades**: ~30

## 🔍 Búsqueda en la Documentación

### Por IDE (VSCode)

1. **Hover sobre código**: Muestra JSDoc automáticamente
2. **Ctrl + Click**: Navega a definición con documentación
3. **IntelliSense**: Autocompleta con documentación inline

### Por Documentación Generada

```bash
# Generar con Compodoc
npx compodoc -s

# Abrir http://localhost:8080
# Usar barra de búsqueda en la interfaz web
```

## 🚀 Mejores Prácticas

1. **Mantener actualizada**: Actualizar JSDoc cuando se modifica código
2. **Ejemplos prácticos**: Incluir siempre ejemplos de uso
3. **Descripciones claras**: Usar lenguaje simple y directo
4. **Tipos precisos**: Especificar tipos completos con TypeScript
5. **Links cruzados**: Usar `@see` para relacionar componentes
6. **Advertencias**: Documentar efectos secundarios y limitaciones

## 📖 Recursos Adicionales

- [JSDoc Official](https://jsdoc.app/)
- [TypeDoc](https://typedoc.org/)
- [Compodoc](https://compodoc.app/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TSDoc](https://tsdoc.org/)

## 📞 Soporte

Para preguntas sobre la documentación:
1. Revisa los ejemplos en el código fuente
2. Consulta la documentación generada
3. Verifica este README

---

**Última actualización**: Enero 2026  
**Versión de documentación**: 1.0.0  
**Cobertura**: 100%
