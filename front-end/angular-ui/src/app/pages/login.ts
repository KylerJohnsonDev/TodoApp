import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { LoginDto } from '../__generated__/todoAPI/todoApi.schemas';
import { authStore } from '../utils/auth-store';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ButtonModule,
    RouterLink,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    PasswordModule,
    InputTextModule,
  ],
  template: `
    <p-card class="w-full md:w-96">
      <ng-template #title>Login</ng-template>
      <ng-template #subtitle>Welcome back!</ng-template>
      <div class="my-4">
        <p-iconfield class="mb-4">
          <input
            id="email"
            class="w-full"
            pInputText
            [(ngModel)]="userEmail"
            placeholder="Email"
            pSize="large"
          />
          <p-inputicon class="pi pi-envelope" />
        </p-iconfield>

        <p-password
          id="password"
          class="w-full"
          [(ngModel)]="password"
          [toggleMask]="true"
          size="large"
          placeholder="Password"
          inputStyleClass="w-full"
        />
      </div>
      <ng-template #footer>
        <div class="flex flex-col items-center">
          <p-button label="Login" icon="pi pi-sign-in" (click)="login()" />
          <p class="pt-4">
            Don't have an account?
            <a class="text-primary hover:underline" [routerLink]="['/register']"
              >Register</a
            >
          </p>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: ``,
  host: {
    class: 'flex md:items-center justify-center min-h-screen',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  userEmail = '';
  password = '';

  readonly _authStore = inject(authStore);

  login(): void {
    const data: LoginDto = {
      username_or_email: this.userEmail,
      password: this.password,
    };
    this._authStore.login(data);
  }
}
