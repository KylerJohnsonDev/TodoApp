import { Routes } from '@angular/router';
import { isAuthenticated } from './features/auth/auth-guard';
import Layout from './layout';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register'),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login'),
  },
  {
    path: '',
    component: Layout,
    canActivateChild: [isAuthenticated],
    children: [
      {
        path: 'todos',
        loadComponent: () => import('./features/todos/todos-page'),
      },
      {
        path: 'action-logs',
        loadComponent: () => import('./features/action-logs/action-logs-page'),
      },
      {
        path: 'account',
        loadComponent: () => import('./features/account/account'),
      },
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
    ],
  },
];
