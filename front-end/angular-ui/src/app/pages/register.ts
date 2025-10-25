import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthService } from '../__generated__/todoAPI/auth/auth.service';
import { RegisterDto } from '../__generated__/todoAPI/todoApi.schemas';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatIconButton,
  ],
  template: `
    <mat-card class="w-full md:w-96">
      <mat-card-header>
        <mat-card-title-group>
          <mat-card-title>
            <h2>Register</h2>
          </mat-card-title>
          <mat-card-subtitle>Welcome to Taskify!</mat-card-subtitle>
        </mat-card-title-group>
      </mat-card-header>
      <mat-card-content>
        <div class="my-4">
          <mat-form-field class="w-full">
            <mat-label>Username</mat-label>
            <input matInput [(ngModel)]="username" placeholder="Username" />
          </mat-form-field>
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="userEmail" placeholder="Email" />
          </mat-form-field>
          <mat-form-field class="w-full ">
            <mat-label>Password</mat-label>
            <input
              matInput
              [(ngModel)]="password"
              placeholder="Password"
              type="password"
            />
          </mat-form-field>
          <mat-form-field class="w-full">
            <mat-label>Confirm Password</mat-label>
            <input
              matInput
              [(ngModel)]="confirmPassword"
              placeholder="Confirm Password"
              type="password"
            />
          </mat-form-field>
        </div>
      </mat-card-content>
      <mat-card-footer>
        <div class="flex flex-col items-center">
          <button mat-flat-button (click)="createAccount()">
            <mat-icon>person_add</mat-icon>
            Create Account
          </button>
          <p class="pt-4">
            Already have an account?
            <a mat-button [routerLink]="['/login']">Sign In</a>
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
export default class Register {
  username = '';
  userEmail = '';
  password = '';
  confirmPassword = '';

  readonly authService = inject(AuthService);

  createAccount() {
    const data: RegisterDto = {
      username: this.username,
      email: this.userEmail,
      password: this.password,
      confirm_password: this.confirmPassword,
    };
    // Logic to handle account creation goes here
    console.log('Account created:', data);
  }
}
