import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideRouter, Router } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { filter, take } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { routes } from './app.routes';
import { todoApiInterceptor } from './interceptors';
import { authStore } from './utils/auth-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([todoApiInterceptor])),
    MessageService,
    provideAppInitializer(() => {
      const _authStore = inject(authStore);
      const router = inject(Router);

      const token = localStorage.getItem('authToken');

      if (!token) {
        console.log('No auth token found on app init, navigating to /login');
        router.navigate(['/login']);
        return EMPTY;
      }

      _authStore.fetchUser();
      return toObservable(_authStore.user).pipe(
        filter((user) => user !== null),
        take(1),
      );
    }),
  ],
};
