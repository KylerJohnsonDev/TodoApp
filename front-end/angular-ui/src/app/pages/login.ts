import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { LoginDto } from '../__generated__/todoAPI/todoApi.schemas';
import { authStore } from '../utils/auth-store';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <mat-card class="w-full md:w-96">
      <mat-card-header>
        <mat-card-title-group>
          <mat-card-title>
            <h2>Login</h2>
          </mat-card-title>
          <mat-card-subtitle>Welcome back!</mat-card-subtitle>
        </mat-card-title-group>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field class="w-full mt-4">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="userEmail" placeholder="Email" />
        </mat-form-field>

        <mat-form-field class="w-full">
          <mat-label>Password</mat-label>
          <input
            matInput
            [(ngModel)]="password"
            placeholder="Password"
            type="password"
          />
        </mat-form-field>
      </mat-card-content>
      <mat-card-footer>
        <div class="flex flex-col items-center">
          <button mat-flat-button (click)="login()">
            <mat-icon>login</mat-icon>
            Login
          </button>
          <p class="pt-4">
            Don't have an account?
            <a
              mat-button
              class="text-primary hover:underline"
              [routerLink]="['/register']"
              >Register</a
            >
          </p>
        </div>
      </mat-card-footer>
    </mat-card>
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
