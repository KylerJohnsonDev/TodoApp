import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { MessageService } from 'primeng/api';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
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
    ) => ({
      register: rxMethod<RegisterDto>(
        pipe(
          concatMap((registerDto) => {
            patchState(store, { loading: true, error: null });
            return authService.postApiAuthRegister(registerDto).pipe(
              tap((result) => {
                if (result.token) {
                  sessionStorage.setItem('authToken', result.token);
                  return;
                }
                throw new Error('No token received upon registration');
              }),
              switchMap(() => {
                return authService.getApiAuthUser().pipe(
                  tapResponse({
                    next: (user) => {
                      patchState(store, { user, loading: false });
                      router.navigate(['/']);
                    },
                    error: (error) => {
                      console.error(
                        'Error fetching user after registration',
                        error,
                      );
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
                    },
                  }),
                );
              }),
            );
          }),
        ),
      ),
      login: rxMethod<LoginDto>(
        pipe(
          concatMap((loginDto) => {
            patchState(store, { loading: true, error: null });
            return authService.postApiAuthLogin(loginDto).pipe(
              tap((result) => {
                if (!result.token) {
                  throw new Error('No token received upon registration');
                }
                sessionStorage.setItem('authToken', result.token);
                console.log('Login successful, token stored in sessionStorage');
              }),
              switchMap(() => {
                return authService.getApiAuthUser().pipe(
                  tapResponse({
                    next: (user) => {
                      console.log({ user: user.email });
                      patchState(store, { user, loading: false });
                      console.log(
                        'User fetched successfully - redirecting to /todos',
                      );
                      router.navigate(['/todos']);
                    },
                    error: (error) => {
                      console.error('Error fetching user after login', error);
                      patchState(store, {
                        error: 'Login failed',
                        loading: false,
                      });
                      messageService.add({
                        severity: 'error',
                        summary: 'Login Failed',
                        detail: 'Please try again later.',
                      });
                    },
                  }),
                );
              }),
            );
          }),
        ),
      ),
      logout: rxMethod<void>(
        pipe(
          tap(() => {
            sessionStorage.removeItem('authToken');
            patchState(store, { ...initialAuthState });
            router.navigate(['/login']);
          }),
        ),
      ),
    }),
  ),
);
