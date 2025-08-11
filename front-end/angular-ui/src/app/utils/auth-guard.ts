import { CanActivateFn } from '@angular/router';

export const isAuthenticated: CanActivateFn = (route, state) => {
  console.log('Auth guard called with route:', route);
  console.log('Auth guard called with state:', state);
  console.log('Route params:', route.params);
  console.log('Route query params:', route.queryParams);
  console.log('Current URL:', state.url);

  return true;
};
