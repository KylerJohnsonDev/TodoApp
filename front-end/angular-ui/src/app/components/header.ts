import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { authStore } from '../utils/auth-store';

@Component({
  selector: 'app-header',
  imports: [
    MenubarModule,
    AvatarModule,
    BadgeModule,
    RouterModule,
    IconFieldModule,
    MenuModule,
  ],
  template: `
    <p-menubar [model]="navItems">
      <ng-template #start>
        <a routerLink="/">
          <svg
            fill="#34d399"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 72 72"
            enable-background="new 0 0 72 72"
            xml:space="preserve"
            stroke="#34d399"
            width="32"
            height="32"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <g>
                    <path
                      d="M60.5,21h-27c-4.687,0-8.5-3.813-8.5-8.5S28.813,4,33.5,4h27c4.687,0,8.5,3.813,8.5,8.5S65.187,21,60.5,21z M33.5,8 c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5h27c2.481,0,4.5-2.019,4.5-4.5S62.981,8,60.5,8H33.5z"
                    ></path>
                  </g>
                  <g>
                    <path
                      d="M60.5,68h-27c-4.687,0-8.5-3.813-8.5-8.5s3.813-8.5,8.5-8.5h27c4.687,0,8.5,3.813,8.5,8.5S65.187,68,60.5,68z M33.5,55 c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5h27c2.481,0,4.5-2.019,4.5-4.5S62.981,55,60.5,55H33.5z"
                    ></path>
                  </g>
                  <g>
                    <path
                      d="M60.5,45h-27c-4.687,0-8.5-3.813-8.5-8.5s3.813-8.5,8.5-8.5h27c4.687,0,8.5,3.813,8.5,8.5S65.187,45,60.5,45z M33.5,32 c-2.481,0-4.5,2.019-4.5,4.5s2.019,4.5,4.5,4.5h27c2.481,0,4.5-2.019,4.5-4.5S62.981,32,60.5,32H33.5z"
                    ></path>
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M12.5,21h-1C6.813,21,3,17.187,3,12.5S6.813,4,11.5,4h1c4.687,0,8.5,3.813,8.5,8.5S17.187,21,12.5,21z M11.5,8 C9.019,8,7,10.019,7,12.5S9.019,17,11.5,17h1c2.481,0,4.5-2.019,4.5-4.5S14.981,8,12.5,8H11.5z"
                    ></path>
                  </g>
                  <g>
                    <path
                      d="M12.5,68h-1C6.813,68,3,64.187,3,59.5S6.813,51,11.5,51h1c4.687,0,8.5,3.813,8.5,8.5S17.187,68,12.5,68z M11.5,55 C9.019,55,7,57.019,7,59.5S9.019,64,11.5,64h1c2.481,0,4.5-2.019,4.5-4.5S14.981,55,12.5,55H11.5z"
                    ></path>
                  </g>
                  <g>
                    <path
                      d="M12.5,45h-1C6.813,45,3,41.187,3,36.5S6.813,28,11.5,28h1c4.687,0,8.5,3.813,8.5,8.5S17.187,45,12.5,45z M11.5,32 C9.019,32,7,34.019,7,36.5S9.019,41,11.5,41h1c2.481,0,4.5-2.019,4.5-4.5S14.981,32,12.5,32H11.5z"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </a>
      </ng-template>
      <ng-template #item let-item let-root="root">
        <a
          pRipple
          class="flex items-center p-menubar-item-link"
          [routerLink]="item.routerLink"
        >
          <i class="{{ item.icon }}"></i>
          <span>{{ item.label }}</span>
          @if (item.shortcut) {
            <span
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
          }
          @if (item.items) {
            // submenu
            <i
              [class]="[
                'ml-auto pi',
                root ? 'pi-angle-down' : 'pi-angle-right',
              ]"
            ></i>
          }
        </a>
      </ng-template>
      <ng-template #end>
        <button class="flex items-center gap-2" (click)="menu.toggle($event)">
          <p-avatar
            image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png"
            shape="circle"
          />
        </button>
        <p-menu #menu [popup]="true" [model]="menuItems" />
      </ng-template>
    </p-menubar>
  `,
  styles: `
    svg {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly navItems: MenuItem[] | undefined = [
    {
      label: `To-Do's`,
      icon: 'pi pi-list-check',
      routerLink: ['/'],
    },
    {
      label: 'Action Logs',
      icon: 'pi pi-list',
      routerLink: ['/action-logs'],
    },
  ];

  readonly menuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-user',
      routerLink: ['/account'],
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      command: () => {
        this._authStore.logout();
      },
    },
  ];

  readonly _authStore = inject(authStore);
}
