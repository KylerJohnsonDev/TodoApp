import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-todos',
  imports: [],
  template: ` <p>todos works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Todos {}
