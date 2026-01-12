# ToDoApp - Aplicación de Lista de Tareas con Angular

Aplicación completa de gestión de tareas con Angular, que incluye categorías, historial y filtros avanzados.

## 🚀 Características

- ✅ **Gestión de Tareas**: Crear, editar, completar y eliminar tareas
- 📁 **Categorías**: Organiza tus tareas por categorías personalizadas
- 📊 **Historial**: Seguimiento completo de cambios y acciones
- 🔍 **Filtros**: Filtra por estado, categoría y fecha
- 🎨 **Prioridades**: Asigna prioridades (Baja, Media, Alta, Urgente)
- 🏷️ **Etiquetas**: Añade etiquetas personalizadas a tus tareas
- 📅 **Fechas de vencimiento**: Programa tus tareas

## 📦 Tecnologías

- **Angular 20+**: Framework principal (zoneless, standalone components)
- **TypeScript**: Lenguaje de programación
- **SCSS**: Estilos
- **RxJS**: Programación reactiva
- **Signals**: Nueva API de reactividad de Angular
- **HttpClient**: Comunicación con API REST

## 🏗️ Arquitectura

```
src/app/
├── core/                      # Funcionalidad core
│   ├── models/               # Interfaces y tipos
│   │   ├── task.model.ts
│   │   ├── category.model.ts
│   │   └── task-history.model.ts
│   ├── services/             # Servicios para API
│   │   ├── task.service.ts
│   │   ├── category.service.ts
│   │   └── task-history.service.ts
│   └── interceptors/         # Interceptores HTTP
│
├── features/                  # Módulos de características
│   ├── task-list/            # Lista de tareas
│   ├── task-form/            # Formulario de nueva tarea
│   ├── task-history/         # Historial de tareas
│   └── categories/           # Gestión de categorías
│
└── shared/                    # Componentes compartidos
    ├── components/
    └── pipes/
```

## 🔧 Instalación

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar el backend API**:
   - Edita `src/environments/environment.ts`
   - Cambia `apiUrl` a la URL de tu backend

## 🚀 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
