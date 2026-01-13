# 💾 Almacenamiento Local - LocalStorage

## Cambios Implementados

Se ha migrado completamente el backend de la aplicación de HTTP a **localStorage**, permitiendo persistencia local en navegador tanto en PC como en móvil.

## 🔄 Servicios Modificados

### 1. **TaskService** - Gestión de Tareas
- ✅ Almacena tareas en `todoapp_tasks`
- ✅ Genera IDs únicos autoincrementales (`task-1`, `task-2`, etc.)
- ✅ Implementa CRUD completo
- ✅ Registra automáticamente cambios en el historial
- ✅ Soporta búsqueda por texto
- ✅ Filtros por categoría y estado

**Métodos disponibles:**
```typescript
getTasks(): Observable<Task[]>
getTaskById(id: string): Observable<Task>
getTasksByCategory(categoryId: string): Observable<Task[]>
getTasksByStatus(status: TaskStatus): Observable<Task[]>
createTask(task: CreateTaskDto): Observable<Task>
updateTask(id: string, task: UpdateTaskDto): Observable<Task>
deleteTask(id: string): Observable<void>
completeTask(id: string): Observable<Task>
searchTasks(query: string): Observable<Task[]>
```

### 2. **CategoryService** - Gestión de Categorías
- ✅ Almacena categorías en `todoapp_categories`
- ✅ Incluye 3 categorías por defecto (Personal, Trabajo, Urgente)
- ✅ Actualiza automáticamente el conteo de tareas
- ✅ Valida nombres duplicados
- ✅ Previene eliminación de categorías con tareas

**Categorías por defecto:**
```typescript
Personal 👤 - #4caf50 (verde)
Trabajo 💼 - #2196f3 (azul)
Urgente ⚡ - #f44336 (rojo)
```

**Métodos disponibles:**
```typescript
getCategories(): Observable<Category[]>
getCategoryById(id: string): Observable<Category>
createCategory(category: CreateCategoryDto): Observable<Category>
updateCategory(id: string, category: Partial<CreateCategoryDto>): Observable<Category>
deleteCategory(id: string): Observable<void>
```

### 3. **TaskHistoryService** - Historial de Cambios
- ✅ Almacena historial en `todoapp_history`
- ✅ Registra automáticamente todas las acciones
- ✅ Limita a 1000 entradas (más antiguas se eliminan)
- ✅ Soporta filtros avanzados
- ✅ Orden cronológico inverso (más recientes primero)

**Acciones registradas:**
- `CREATED` - Tarea creada
- `UPDATED` - Tarea modificada
- `COMPLETED` - Tarea completada
- `STARTED` - Tarea iniciada
- `DELETED` - Tarea eliminada

**Métodos disponibles:**
```typescript
getHistory(filter?: TaskHistoryFilter): Observable<TaskHistory[]>
getTaskHistory(taskId: string): Observable<TaskHistory[]>
getRecentHistory(limit?: number): Observable<TaskHistory[]>
```

## 📦 Estructura de Almacenamiento

### localStorage Keys
```javascript
todoapp_tasks           // Array de tareas
todoapp_tasks_counter   // Contador para IDs de tareas
todoapp_categories      // Array de categorías
todoapp_categories_counter // Contador para IDs de categorías
todoapp_history         // Array de historial
todoapp_history_counter // Contador para IDs de historial
```

### Ejemplo de Datos Almacenados

#### Tarea
```json
{
  "id": "task-1",
  "title": "Completar proyecto",
  "description": "Finalizar la implementación",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "categoryId": "cat-2",
  "tags": ["trabajo", "urgente"],
  "createdAt": "2026-01-13T10:00:00.000Z",
  "updatedAt": "2026-01-13T14:30:00.000Z"
}
```

#### Categoría
```json
{
  "id": "cat-1",
  "name": "Personal",
  "color": "#4caf50",
  "icon": "👤",
  "description": "Tareas personales",
  "taskCount": 5,
  "createdAt": "2026-01-13T10:00:00.000Z"
}
```

#### Historial
```json
{
  "id": "history-1",
  "taskId": "task-1",
  "action": "UPDATED",
  "timestamp": "2026-01-13T14:30:00.000Z",
  "oldValues": {
    "status": "PENDING",
    "title": "Título anterior"
  },
  "newValues": {
    "status": "IN_PROGRESS",
    "title": "Nuevo título"
  }
}
```

## ✨ Ventajas del LocalStorage

### 1. **Funciona Sin Conexión** 🌐
- ✅ La app funciona completamente offline
- ✅ No requiere servidor backend
- ✅ Ideal para PWA

### 2. **Sincronización Instantánea** ⚡
- ✅ Cambios inmediatos sin latencia de red
- ✅ No hay retrasos en actualizaciones
- ✅ Experiencia de usuario fluida

### 3. **Portabilidad** 📱
- ✅ Funciona en PC y móvil por igual
- ✅ Cada dispositivo tiene sus propios datos
- ✅ No hay conflictos entre dispositivos

### 4. **Simplicidad** 🎯
- ✅ No necesita configuración de servidor
- ✅ Sin dependencias de red
- ✅ Fácil de mantener y debuggear

### 5. **Privacidad** 🔒
- ✅ Datos almacenados localmente
- ✅ No se envían a servidores externos
- ✅ Control total del usuario

## 🔧 Uso en Componentes

### Ejemplo: Crear Tarea
```typescript
import { TaskService } from '@core/services/task.service';

export class TaskFormComponent {
  private taskService = inject(TaskService);
  
  createTask() {
    const newTask: CreateTaskDto = {
      title: 'Nueva tarea',
      description: 'Descripción de la tarea',
      priority: TaskPriority.HIGH,
      categoryId: 'cat-1',
      tags: ['importante']
    };
    
    this.taskService.createTask(newTask).subscribe({
      next: (task) => {
        console.log('Tarea creada:', task.id);
        // La tarea ya está en localStorage
        // El historial se registró automáticamente
      },
      error: (err) => console.error('Error:', err)
    });
  }
}
```

### Ejemplo: Listar Tareas
```typescript
loadTasks() {
  this.taskService.getTasks().subscribe({
    next: (tasks) => {
      this.tasks = tasks;
      console.log(`${tasks.length} tareas cargadas desde localStorage`);
    }
  });
}
```

### Ejemplo: Actualizar Tarea
```typescript
updateTask(taskId: string) {
  const updates: UpdateTaskDto = {
    status: TaskStatus.COMPLETED
  };
  
  this.taskService.updateTask(taskId, updates).subscribe({
    next: (task) => {
      console.log('Tarea actualizada:', task);
      // El historial registró: COMPLETED
    }
  });
}
```

### Ejemplo: Ver Historial
```typescript
loadHistory() {
  this.historyService.getRecentHistory(10).subscribe({
    next: (history) => {
      history.forEach(entry => {
        console.log(`${entry.action}: ${entry.timestamp}`);
      });
    }
  });
}
```

## 🗑️ Gestión de Datos

### Limpiar Todo
```javascript
// Desde DevTools Console
localStorage.removeItem('todoapp_tasks');
localStorage.removeItem('todoapp_categories');
localStorage.removeItem('todoapp_history');
localStorage.removeItem('todoapp_tasks_counter');
localStorage.removeItem('todoapp_categories_counter');
localStorage.removeItem('todoapp_history_counter');

// O limpiar todo de una vez
Object.keys(localStorage)
  .filter(key => key.startsWith('todoapp_'))
  .forEach(key => localStorage.removeItem(key));
```

### Exportar Datos
```javascript
// Crear backup de todos los datos
const backup = {
  tasks: JSON.parse(localStorage.getItem('todoapp_tasks') || '[]'),
  categories: JSON.parse(localStorage.getItem('todoapp_categories') || '[]'),
  history: JSON.parse(localStorage.getItem('todoapp_history') || '[]')
};

// Descargar como JSON
const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `todoapp-backup-${new Date().toISOString()}.json`;
a.click();
```

### Importar Datos
```javascript
// Restaurar desde backup
function importBackup(backupData) {
  localStorage.setItem('todoapp_tasks', JSON.stringify(backupData.tasks));
  localStorage.setItem('todoapp_categories', JSON.stringify(backupData.categories));
  localStorage.setItem('todoapp_history', JSON.stringify(backupData.history));
  location.reload(); // Recargar para reflejar cambios
}
```

## 📊 Inspeccionar Datos

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a **Application** → **Local Storage**
3. Selecciona tu dominio
4. Verás todas las claves `todoapp_*`
5. Haz doble click para editar

### Consola del Navegador
```javascript
// Ver todas las tareas
console.table(JSON.parse(localStorage.getItem('todoapp_tasks')));

// Ver todas las categorías
console.table(JSON.parse(localStorage.getItem('todoapp_categories')));

// Ver historial reciente
console.table(JSON.parse(localStorage.getItem('todoapp_history')).slice(0, 10));

// Contar entradas
const tasks = JSON.parse(localStorage.getItem('todoapp_tasks') || '[]');
console.log(`Total de tareas: ${tasks.length}`);
```

## ⚠️ Limitaciones

### 1. **Capacidad de Almacenamiento**
- LocalStorage tiene límite de ~5-10MB por dominio
- Para miles de tareas, considera IndexedDB

### 2. **Sin Sincronización entre Dispositivos**
- Cada dispositivo tiene sus propios datos
- Los datos en el móvil no se sincronizan con PC

### 3. **Datos pueden Perderse**
- Si el usuario limpia la caché del navegador
- Si el usuario usa modo incógnito
- Considera implementar exportar/importar

### 4. **Sin Acceso Compartido**
- No hay colaboración entre usuarios
- Cada usuario ve solo sus datos

## 🚀 Futuras Mejoras

### Opción 1: Sincronización Cloud
```typescript
// Agregar sync con Firebase/Supabase
syncToCloud() {
  const data = this.getAllLocalData();
  return this.cloudService.upload(data);
}
```

### Opción 2: IndexedDB
```typescript
// Migrar a IndexedDB para mayor capacidad
// Soporta hasta 50MB+ de datos
```

### Opción 3: Exportar/Importar
```typescript
// Ya incluido en la guía arriba
// Permite backup y restauración manual
```

## ✅ Compatibilidad

- ✅ **PC**: Chrome, Firefox, Edge, Safari
- ✅ **Móvil Android**: Chrome, Samsung Internet
- ✅ **Móvil iOS**: Safari, Chrome iOS
- ✅ **PWA**: Funciona perfectamente
- ✅ **Modo Offline**: Totalmente funcional

---

**Resultado**: La aplicación ahora es completamente autónoma, funciona sin servidor y persiste datos localmente en cualquier dispositivo.
