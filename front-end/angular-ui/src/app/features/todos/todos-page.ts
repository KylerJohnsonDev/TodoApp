import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { TodosService } from '../../__generated__/todoAPI/todos/todos.service';
import { TodoForm } from './todo-form';
import { TodoTable } from './todo-table';
import { todosStore } from './todos.store';

@Component({
  selector: 'app-todos',
  imports: [TodoForm, MatCardModule, TodoTable],
  template: `
    <!-- <mat-card>
      <mat-card-header>
        <mat-card-title>Add New Task</mat-card-title>
      </mat-card-header>
      <mat-card-content class="mt-4"> -->
    <app-todo-form
      [isLoading]="store.CREATE_TODO_KEYLoading()"
      (submitNewTodo)="store.createTodo($event)"
    />
    <!-- </mat-card-content>
    </mat-card> -->
    <app-todo-table
      [todos]="store.todos()"
      (deleteTodo)="store.deleteTodo($event)"
      (updateTodo)="store.updateTodo($event)"
      (deleteMultipleTodos)="store.deleteMultipleTodos($event)"
      (updateMultipleTodoStatus)="store.updateMultipleTodoStatus($event)"
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
}
