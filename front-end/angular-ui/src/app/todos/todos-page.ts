import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TodoTable } from './todo-table';

@Component({
  selector: 'app-todos',
  imports: [TodoTable],
  template: ` <app-todo-table /> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TodosPage {}
