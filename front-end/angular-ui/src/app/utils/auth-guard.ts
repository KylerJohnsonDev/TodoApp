import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { authStore } from './auth-store';

export const isAuthenticated: CanActivateFn = (route, state) => {
  const _authStore = inject(authStore);
  const user = _authStore.user();
  const token = localStorage.getItem('authToken');
  if (!user || !token) {
    console.log({ user, token });
    console.log(route, state);
    localStorage.setItem('redirectAfterLogin', state.url);
    console.log(
      `Not authenticated, setting redirectAfterLogin in localStorage: ${state.url}`,
    );
    const urlTree = createUrlTreeFromSnapshot(route, ['/login']);
    return urlTree;
  }

  if (localStorage.getItem('redirectAfterLogin')) {
    console.log(
      `Found redirectAfterLogin in localStorage: ${localStorage.getItem('redirectAfterLogin')}`,
    );
    const redirectUrl = localStorage.getItem('redirectAfterLogin')!;
    localStorage.removeItem('redirectAfterLogin');
    const urlTree = createUrlTreeFromSnapshot(route, [redirectUrl]);
    console.log(`Redirecting to ${redirectUrl} by urlTree:`, urlTree);
    return urlTree;
  }

  return true;
};
