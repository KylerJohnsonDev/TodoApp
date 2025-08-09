import { Routes } from '@angular/router';
import ActionLogs from './pages/protected/action-logs';
import Layout from './pages/protected/layout';
import Todos from './pages/protected/todos';

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
      { path: 'todos', component: Todos },
      { path: 'action-logs', component: ActionLogs },
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
    ],
  },
];
