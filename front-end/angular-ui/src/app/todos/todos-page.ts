import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { TodoResponseDto } from '../__generated__/todoAPI/todoApi.schemas';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';
import { TodoForm } from './todo-form';
import { TodoTable } from './todo-table';
import { TodoTableMenuActions } from './todo.models';
import { todosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  imports: [TodoTable, TodoForm],
  template: `
    <app-todo-form
      [isLoading]="store.CREATE_TODO_KEYLoading()"
      (submitNewTodo)="store.createTodo($event)"
    />

    <app-todo-table
      [todos]="store.todos()"
      (deleteTodo)="store.deleteTodo($event)"
      (updateTodo)="store.updateTodo($event)"
      (tableActionSelected)="handleTableAction($event)"
    />
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

  handleTableAction(event: {
    action: TodoTableMenuActions;
    todos: TodoResponseDto[];
  }): void {
    switch (event.action) {
      // case 'complete_many':
      //   this.store.completeTodos(event.todos);
      //   break;
      // case 'reopen_many':
      //   this.store.reopenTodos(event.todos);
      //   break;
      case 'delete_many':
        this.store.deleteMultipleTodos(event.todos);
        break;
    }
  }
}
