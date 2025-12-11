import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header],
  template: `
    <app-header />
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    :host {
      display: flex;
      height: 100%;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {}
