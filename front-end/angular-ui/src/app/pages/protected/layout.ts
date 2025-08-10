import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../components/header';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Header],
  template: `
    <app-header />
    <router-outlet></router-outlet>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {}
