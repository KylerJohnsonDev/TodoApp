import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TodoResponseDto } from '../__generated__/todoAPI/todoApi.schemas';
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
          <td>{{ todo.text }}</td>
          <td>{{ todo.createdAt | date }}</td>
          <td>{{ todo.status }}</td>
          <td>{{ todo.completedAt | date }}</td>
          <td>
            <p-button
              severity="danger"
              icon="pi pi-trash"
              (click)="deleteTodo.emit(todo)"
            />
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
}
