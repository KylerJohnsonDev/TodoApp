import { Routes } from '@angular/router';
import Layout from './pages/protected/layout';
import { isAuthenticated } from './utils/auth-guard';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./pages/register'),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login'),
  },
  {
    path: '',
    component: Layout,
    canActivateChild: [isAuthenticated],
    children: [
      { path: 'todos', loadComponent: () => import('./todos/todos-page') },
      {
        path: 'action-logs',
        loadComponent: () => import('./action-logs/action-logs-page'),
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/protected/account'),
      },
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
    ],
  },
];
