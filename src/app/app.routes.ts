import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    loadComponent: () => import('./features/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/task-history/task-history.component').then(m => m.TaskHistoryComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: '**',
    redirectTo: '/tasks'
  }
];
