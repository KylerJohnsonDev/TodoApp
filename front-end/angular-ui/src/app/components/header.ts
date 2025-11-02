import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { authStore } from '../utils/auth-store';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar class="flex justify-between gap-2">
      <a class="text-3xl" routerLink="/">Taskify</a>
      <span class="grow"></span>
      @for (navItem of navItems; track navItem.label) {
        <button mat-flat-button class="">
          <mat-icon [fontIcon]="navItem.icon" />
          {{ navItem.label }}
        </button>
      }
      <button
        matIconButton
        aria-label="Example icon-button with menu icon"
        [matMenuTriggerFor]="profileMenu"
      >
        <mat-icon class="text-7xl">account_circle</mat-icon>
      </button>
    </mat-toolbar>

    <mat-menu #profileMenu="matMenu">
      @for (item of menuItems; track item.label) {
        @if (item.routerLink) {
          <a mat-menu-item [routerLink]="item.routerLink">
            <mat-icon [fontIcon]="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        } @else {
          <button mat-menu-item (click)="item.command?.()">
            <mat-icon [fontIcon]="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        }
      }
    </mat-menu>
  `,
  styles: `
    svg {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly navItems: { label: string; icon: string; routerLink: string[] }[] = [
    {
      label: `To-Do's`,
      icon: 'list_alt_check',
      routerLink: ['/'],
    },
    {
      label: 'Action Logs',
      icon: 'view_list',
      routerLink: ['/action-logs'],
    },
  ];

  readonly menuItems: {
    label: string;
    icon: string;
    routerLink?: string[];
    command?: () => void;
  }[] = [
    {
      label: 'Account',
      icon: 'account_box',
      routerLink: ['/account'],
    },
    {
      label: 'Sign Out',
      icon: 'logout',
      command: () => {
        this._authStore.logout();
      },
    },
  ];

  readonly _authStore = inject(authStore);
}
