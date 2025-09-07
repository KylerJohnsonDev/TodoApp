import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';
import { TodoForm } from './todo-form';
import { TodoTable } from './todo-table';
import { todosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  imports: [TodoTable, TodoForm],
  template: `
    <app-todo-form />

    <app-todo-table [todos]="store.todos()" />
  `,
  styles: `
    :host {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [todosStore, TodosService],
})
export default class TodosPage {
  readonly store = inject(todosStore);

  readonly fetchTodos = effect(() => this.store.fetchTodos());
}
