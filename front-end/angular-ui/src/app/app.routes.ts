import { Routes } from '@angular/router';
import Layout from './pages/protected/layout';

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
    children: [
      { path: 'todos', loadComponent: () => import('./pages/protected/todos') },
      {
        path: 'action-logs',
        loadComponent: () => import('./pages/protected/action-logs'),
      },
      {
        path: 'account',
        loadComponent: () => import('./pages/protected/account'),
      },
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
    ],
  },
];
