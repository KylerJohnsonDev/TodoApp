import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  TodoResponseDto,
  TodoStatus,
} from '../__generated__/todoAPI/todoApi.schemas';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';
import { todosStore } from './todos.store';

@Component({
  selector: 'app-todo-list',
  imports: [
    MatCardModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-card>
      <mat-card-header class="flex justify-between gap-2">
        <mat-card-title>
          <h3 class="text-2xl">
            {{ todos().length }} Total
            @if (selectedTodos().length > 0) {
              ({{ selectedTodos().length }} Selected)
            }
          </h3>
        </mat-card-title>
        <button mat-flat-button [matMenuTriggerFor]="menu">
          <mat-icon>menu</mat-icon>
          Actions
        </button>
        <mat-menu #menu="matMenu">
          <button
            mat-menu-item
            (click)="deleteMultipleTodos.emit(selectedTodos())"
          >
            <mat-icon>delete</mat-icon>
            <span>Delete selected</span>
          </button>
        </mat-menu>
      </mat-card-header>

      <mat-selection-list
        #tasksList
        [multiple]="true"
        (selectionChange)="
          onSelectionChange($event.source.selectedOptions.selected)
        "
      >
        @for (todo of todos(); track todo.id) {
          <mat-list-option [value]="todo">{{ todo.text }}</mat-list-option>
        }
      </mat-selection-list>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TodosService, todosStore],
})
export class TodoList {
  readonly todos = input.required<TodoResponseDto[]>();
  readonly deleteTodo = output<TodoResponseDto>();
  readonly updateTodo = output<{
    todo: TodoResponseDto;
    type: 'complete' | 'reopen';
  }>();
  readonly deleteMultipleTodos = output<TodoResponseDto[]>();
  readonly updateMultipleTodoStatus = output<{
    todos: TodoResponseDto[];
    status: TodoStatus;
  }>();
  selectedTodos = signal<TodoResponseDto[]>([]);
  readonly todosListRef = viewChild('tasksList', { read: ElementRef });
  onSelectionChange(selectedOptions: MatListOption[]): void {
    this.selectedTodos.set(selectedOptions.map((option) => option.value));
  }
}
