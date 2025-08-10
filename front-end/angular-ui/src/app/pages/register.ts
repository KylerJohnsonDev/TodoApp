import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    RouterLink,
  ],
  template: `
    <p-card class="w-full md:w-96">
      <ng-template #title>Create Account</ng-template>
      <ng-template #subtitle>Welcome to TodoApp!</ng-template>
      <div class="my-4">
        <p-iconfield class="mb-4">
          <input
            id="firstName"
            class="w-full"
            pInputText
            [(ngModel)]="firstName"
            placeholder="First Name"
            pSize="large"
          />
          <p-inputicon class="pi pi-user" />
        </p-iconfield>
        <p-iconfield class="mb-4">
          <input
            id="lastName"
            class="w-full"
            pInputText
            [(ngModel)]="lastName"
            placeholder="Last Name"
            pSize="large"
          />
          <p-inputicon class="pi pi-user" />
        </p-iconfield>
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
          class="w-full mb-4"
          [(ngModel)]="password"
          [toggleMask]="true"
          size="large"
          placeholder="Password"
          inputStyleClass="w-full"
        />

        <p-password
          id="confirmPassword"
          class="w-full"
          [(ngModel)]="confirmPassword"
          [toggleMask]="true"
          size="large"
          placeholder="Confirm Password"
          inputStyleClass="w-full"
        />
      </div>
      <ng-template #footer>
        <div class="flex flex-col items-center">
          <p-button
            label="Create Account"
            icon="pi pi-sign-in"
            (click)="createAccount()"
          />
          <p class="pt-4">
            Already have an account?
            <a class="text-primary hover:underline" [routerLink]="['/login']"
              >Sign In</a
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
export default class Register {
  firstName = '';
  lastName = '';
  userEmail = '';
  password = '';
  confirmPassword = '';

  createAccount() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.userEmail,
      password: this.password,
    };
    // Logic to handle account creation goes here
    console.log('Account created:', data);
  }
}
