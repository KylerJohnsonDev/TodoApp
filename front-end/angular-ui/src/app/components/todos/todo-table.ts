import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TodoResponseDto } from '../../__generated__/model';
import { getGetTodosResponseMock } from '../../__generated__/todos/todos.msw';
import { TodosService } from '../../__generated__/todos/todos.service';

@Component({
  selector: 'app-todo-table',
  imports: [TableModule, DatePipe],
  template: `
    <p-table
      [value]="todos"
      [(selection)]="selectedTodos"
      dataKey="code"
      [tableStyle]="{ 'min-width': '50rem' }"
    >
      <ng-template #header>
        <tr>
          <th style="width: 4rem"><p-tableHeaderCheckbox /></th>
          <th>To-Do</th>
          <th>Created</th>
          <th>Status</th>
          <th>Date Completed</th>
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
        </tr>
      </ng-template>
    </p-table>
  `,
  styles: ``,
  providers: [TodosService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTable {
  readonly todoService = inject(TodosService);
  readonly todos = getGetTodosResponseMock();
  readonly selectedTodos: TodoResponseDto[] = [];
}
