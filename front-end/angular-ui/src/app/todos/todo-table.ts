import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {
  TodoResponseDto,
  TodoStatus,
} from '../__generated__/todoAPI/todoApi.schemas';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';

@Component({
  selector: 'app-todo-table',
  imports: [TableModule, DatePipe, ButtonModule],
  template: `
    <p-table
      [value]="todos()"
      [(selection)]="selectedTodos"
      [tableStyle]="{ 'min-width': '50rem' }"
      [dataKey]="'id'"
    >
      <ng-template #header>
        <tr>
          <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
          <th>To-Do</th>
          <th>Created</th>
          <th>Status</th>
          <th>Date Completed</th>
          <th></th>
        </tr>
      </ng-template>
      <ng-template #body let-todo>
        <tr>
          <td>
            <p-tableCheckbox [value]="todo" />
          </td>
          <td [class]="{ 'line-through': todo.status === TodoStatus.NUMBER_2 }">
            {{ todo.text }}
          </td>
          <td>{{ todo.created_at | date: 'short' }}</td>
          <td>{{ todo.status }}</td>
          <td>
            @if (todo.completed_at) {
              {{ todo.completed_at | date: 'short' }}
            } @else {
              --
            }
          </td>
          <td class="flex gap-1 justify-end">
            <p-button
              severity="danger"
              icon="pi pi-trash"
              (click)="deleteTodo.emit(todo)"
            />
            @if (todo.status === TodoStatus.NUMBER_2) {
              <p-button
                severity="secondary"
                icon="pi pi-undo"
                (click)="updateTodo.emit({ todo: todo, type: 'reopen' })"
              />
            } @else {
              <p-button
                severity="primary"
                icon="pi pi-check"
                (click)="updateTodo.emit({ todo: todo, type: 'complete' })"
              />
            }
          </td>
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
  providers: [TodosService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTable {
  readonly todos = input<TodoResponseDto[]>([]);
  selectedTodos = [];
  readonly deleteTodo = output<TodoResponseDto>();
  readonly updateTodo = output<{
    todo: TodoResponseDto;
    type: 'complete' | 'reopen';
  }>();
  readonly TodoStatus = TodoStatus;
}
