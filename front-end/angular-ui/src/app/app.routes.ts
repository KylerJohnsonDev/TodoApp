import { Routes } from '@angular/router';
import TodosPage from './todos/todos-page';
import DefaultLayout from './layouts/default-layout';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./auth/register-page')
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login-page')
  },
  {
    path: '',
    component: DefaultLayout,
    children: [
      { path: 'todos', component: TodosPage },
      { path: 'account', loadComponent: () => import('./pages/account-page') },
      { path: '', redirectTo: 'todos', pathMatch: 'full' },
    ]
  },
];
