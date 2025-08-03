import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
  <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css'],
  host: {
    class: 'w-full h-full',
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('angular-ui');

  ngOnInit(): void {
    initFlowbite();
  }
}
