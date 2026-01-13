# 🧭 Sistema de Navegación Programática

## Cambios Implementados

Se ha refactorizado el sistema de navegación de la aplicación para usar **navegación programática** en lugar de directivas `routerLink` directas.

## 📋 Resumen de Cambios

### Antes (Navegación Declarativa)
```html
<a routerLink="/tasks" routerLinkActive="active">Tareas</a>
```

### Después (Navegación Programática)
```html
<a (click)="navigateToTasks()" 
   [class.active]="isRouteActive('/tasks')">Tareas</a>
```

## 🔧 Archivos Modificados

### 1. app.ts

Se agregaron los siguientes métodos:

#### Métodos de Navegación

```typescript
/**
 * Navega a la página de listado de tareas
 */
navigateToTasks(): Promise<boolean>

/**
 * Navega al formulario de creación de nueva tarea
 */
navigateToNewTask(): Promise<boolean>

/**
 * Navega a la página de gestión de categorías
 */
navigateToCategories(): Promise<boolean>

/**
 * Navega a la página de historial de cambios
 */
navigateToHistory(): Promise<boolean>
```

#### Método de Detección de Ruta Activa

```typescript
/**
 * Verifica si una ruta está activa actualmente
 * @param route - Ruta a verificar
 * @returns true si la ruta está activa
 */
isRouteActive(route: string): boolean
```

### 2. app.html

- Reemplazados todos los `routerLink` por eventos `(click)`
- Reemplazado `routerLinkActive` por binding `[class.active]`
- Agregados atributos `role="button"` y `tabindex="0"` para accesibilidad

### 3. app.scss

- Agregado `cursor: pointer` para indicar clickeabilidad
- Agregado `user-select: none` para evitar selección de texto
- Mejorado `outline` para mejor accesibilidad con teclado
- Agregado `:focus-visible` para navegación con teclado

## ✨ Ventajas de la Navegación Programática

### 1. **Mayor Control**
```typescript
navigateToNewTask(): Promise<boolean> {
  // Se puede agregar lógica antes de navegar
  console.log('Navegando a nueva tarea...');
  
  // Se puede validar condiciones
  if (someCondition) {
    return this.router.navigate(['/tasks/new']);
  }
  
  // Se puede manejar la promesa
  return Promise.resolve(false);
}
```

### 2. **Confirmaciones Antes de Navegar**
```typescript
navigateToCategories(): Promise<boolean> {
  if (this.hasUnsavedChanges) {
    const confirm = window.confirm('¿Descartar cambios?');
    if (!confirm) return Promise.resolve(false);
  }
  return this.router.navigate(['/categories']);
}
```

### 3. **Logging y Analytics**
```typescript
navigateToTasks(): Promise<boolean> {
  // Registrar navegación
  this.analyticsService.track('navigate_to_tasks');
  
  // Continuar navegación
  return this.router.navigate(['/tasks']);
}
```

### 4. **Navegación Condicional**
```typescript
navigateToHistory(): Promise<boolean> {
  // Verificar permisos
  if (!this.authService.hasPermission('view_history')) {
    this.showError('No tienes permisos');
    return Promise.resolve(false);
  }
  
  return this.router.navigate(['/history']);
}
```

### 5. **Parámetros Dinámicos**
```typescript
navigateToTaskEdit(taskId: string): Promise<boolean> {
  return this.router.navigate(['/tasks/edit', taskId], {
    queryParams: { returnUrl: this.router.url }
  });
}
```

### 6. **Manejo de Errores**
```typescript
async navigateToCategories(): Promise<boolean> {
  try {
    const success = await this.router.navigate(['/categories']);
    if (!success) {
      console.error('Navegación falló');
    }
    return success;
  } catch (error) {
    console.error('Error en navegación:', error);
    return false;
  }
}
```

## 🎯 Ejemplos de Uso Avanzado

### Navegación con Confirmación
```typescript
navigateToNewTask(): Promise<boolean> {
  // Verificar si hay cambios sin guardar
  if (this.hasUnsavedChanges()) {
    const proceed = confirm('Tienes cambios sin guardar. ¿Continuar?');
    if (!proceed) {
      return Promise.resolve(false);
    }
  }
  
  return this.router.navigate(['/tasks/new']);
}
```

### Navegación con Loading
```typescript
async navigateToHistory(): Promise<boolean> {
  // Mostrar loader
  this.loading.set(true);
  
  try {
    const result = await this.router.navigate(['/history']);
    return result;
  } finally {
    this.loading.set(false);
  }
}
```

### Navegación con Animaciones
```typescript
navigateToTasks(): Promise<boolean> {
  // Aplicar clase de transición
  this.transitioning = true;
  
  setTimeout(() => {
    this.transitioning = false;
  }, 300);
  
  return this.router.navigate(['/tasks']);
}
```

## 🔐 Accesibilidad

Los enlaces ahora incluyen:

- `role="button"` - Indica que son elementos clickeables
- `tabindex="0"` - Permite navegación con teclado
- `:focus-visible` - Mejor indicación visual al navegar con teclado
- `aria-label` - Descripciones para lectores de pantalla

### Navegación con Teclado
- `Tab` - Navegar entre enlaces
- `Enter` o `Space` - Activar el enlace
- `Shift + Tab` - Navegar hacia atrás

## 📱 Compatibilidad Mobile

Los estilos están optimizados para:
- **Touch**: Áreas mínimas de 44x44px
- **Feedback visual**: Transformaciones en `:active`
- **Prevención de selección**: `user-select: none`

## 🚀 Futuras Mejoras

### 1. Guardar Estado de Navegación
```typescript
navigateToTasks(): Promise<boolean> {
  // Guardar scroll position
  this.navigationState.saveCurrent();
  
  return this.router.navigate(['/tasks']);
}
```

### 2. Navegación con Historial
```typescript
navigateBack(): void {
  this.location.back();
}
```

### 3. Prefetch de Rutas
```typescript
prefetchRoute(route: string): void {
  // Pre-cargar componente
  this.router.navigate([route], { skipLocationChange: true });
}
```

## 🧪 Testing

### Ejemplo de Test
```typescript
describe('App Navigation', () => {
  it('should navigate to tasks', async () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    
    const app = fixture.componentInstance;
    await app.navigateToTasks();
    
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
```

## 📚 Recursos

- [Angular Router Guide](https://angular.io/guide/router)
- [Programmatic Navigation](https://angular.io/api/router/Router#navigate)
- [Router Events](https://angular.io/api/router/RouterEvent)

## ✅ Checklist de Implementación

- [x] Métodos de navegación creados
- [x] Template actualizado con eventos click
- [x] Estilos de cursor y accesibilidad
- [x] Detección de ruta activa
- [x] Documentación JSDoc completa
- [x] Soporte para navegación con teclado
- [x] Feedback visual para interacciones

---

**Ventaja principal**: Ahora tienes control total sobre cada acción de navegación, pudiendo agregar validaciones, confirmaciones, logging, y cualquier lógica necesaria antes de navegar.
