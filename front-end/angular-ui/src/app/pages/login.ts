import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  imports: [CardModule, ButtonModule, RouterLink],
  template: `
    <p-card class="w-full md:w-96">
      <ng-template #title>Login</ng-template>
      <ng-template #subTitle>Welcome back!</ng-template>
      <ng-template #footer>
        <p-button label="Login" icon="pi pi-sign-in" />
        <p class="pt-4">
          Don't have an account?
          <a [routerLink]="['/register']">Register here</a>
        </p>
      </ng-template>
    </p-card>
  `,
  styles: ``,
  host: {
    class: 'flex items-center justify-center min-h-screen',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {}
