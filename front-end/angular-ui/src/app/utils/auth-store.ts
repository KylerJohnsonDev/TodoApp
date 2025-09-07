import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { catchError, concatMap, of, pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../__generated__/todoAPI/auth/auth.service';
import {
  LoginDto,
  RegisterDto,
  UserDto,
} from '../__generated__/todoAPI/todoApi.schemas';

interface AuthState {
  user: UserDto | null;
  error: string | null;
  loading: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

export const authStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialAuthState),
  withMethods(
    (
      store,
      authService = inject(AuthService),
      messageService = inject(MessageService),
      router = inject(Router),
    ) => {
      const register = rxMethod<RegisterDto>(
        pipe(
          concatMap((registerDto) => {
            patchState(store, { loading: true, error: null });
            return authService.postApiAuthRegister(registerDto).pipe(
              tap((result) => {
                if (result.token) {
                  localStorage.setItem('authToken', result.token);
                  fetchUser();
                  return;
                }
                throw new Error('No token received upon registration');
              }),
              catchError((error) => {
                console.error('Registration error', error);
                patchState(store, {
                  error: 'Registration failed',
                  loading: false,
                });
                messageService.add({
                  key: 'bc',
                  severity: 'error',
                  summary: 'Registration Failed',
                  detail: 'Please try again later.',
                });
                return of([]);
              }),
            );
          }),
        ),
      );
      const login = rxMethod<LoginDto>(
        pipe(
          concatMap((loginDto) => {
            patchState(store, { loading: true, error: null });
            return authService.postApiAuthLogin(loginDto).pipe(
              tap((result) => {
                if (!result.token) {
                  throw new Error('No token received upon registration');
                }
                localStorage.setItem('authToken', result.token);
                fetchUser();
              }),
              catchError((errorResponse) => {
                console.error(errorResponse);
                const errorMessage =
                  errorResponse?.error?.message ??
                  'Unable to authenticate. Please try again later.';
                patchState(store, { error: errorMessage, loading: false });
                messageService.add({
                  severity: 'error',
                  summary: 'Login Failed',
                  detail: errorMessage,
                });
                return of([]);
              }),
            );
          }),
        ),
      );
      const logout = rxMethod<void>(
        pipe(
          tap(() => {
            localStorage.removeItem('authToken');
            patchState(store, { ...initialAuthState });
            messageService.add({
              severity: 'info',
              summary: 'Goodbye',
              detail: 'You have been logged out successfully.',
            });
            router.navigate(['/login']);
          }),
        ),
      );

      const fetchUser = rxMethod<void>(
        pipe(
          switchMap(() => {
            return authService.getApiAuthUser().pipe(
              tapResponse({
                next: (user) => {
                  console.log('Fetched user', user);
                  patchState(store, { user, loading: false });
                  router.navigate(['/']);
                },
                error: (error) => {
                  console.error('Error fetching user', error);
                },
              }),
              // tapResponse({
              //   next: (user) => {
              //     patchState(store, { user, loading: false });
              //     router.navigate(['/']);
              //   },
              //   error: (error) => {
              //     console.error('Error fetching user', error);
              //   },
              // }),
              // map((user) => user),
            );
          }),
        ),
      );

      return {
        register,
        login,
        logout,
        fetchUser,
      };
    },
  ),
);
