import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { provideRouter, Router } from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { filter, take } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { routes } from './app.routes';
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
    provideHttpClient(withInterceptorsFromDi()),
    MessageService,
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => localStorage.getItem('authToken'),
          allowedDomains: ['localhost:5000'],
        },
      }),
    ),
    provideAppInitializer(() => {
      const _authStore = inject(authStore);
      const router = inject(Router);
      const jwtHelperService = inject(JwtHelperService);

      const token = localStorage.getItem('authToken');
      const isTokenExpired = jwtHelperService.isTokenExpired(token);
      if (!token || isTokenExpired) {
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
