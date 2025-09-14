import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import {
  TodoResponseDto,
  TodoStatus,
} from '../__generated__/todoAPI/todoApi.schemas';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';
import { TodoTableMenuActions } from './todo.models';

@Component({
  selector: 'app-todo-table',
  imports: [
    TableModule,
    CardModule,
    DatePipe,
    ButtonModule,
    MenuModule,
    TooltipModule,
  ],
  template: `
    <p-card>
      <section class="mx-4 py-2 flex justify-between align-items">
        <div class="flex gap-1">
          <h2 class="m-0">{{ todos().length }} Tasks</h2>
          @if (selectedTodos().length > 0) {
            ({{ selectedTodos().length }} selected)
          }
        </div>
        <p-menu
          #menu
          [model]="items()"
          [popup]="true"
          (onShow)="actionsMenuIcon.set('pi pi-chevron-down')"
          (onHide)="actionsMenuIcon.set('pi pi-chevron-right')"
        />
        <p-button
          (click)="menu.toggle($event)"
          label="Actions"
          variant="outlined"
          [icon]="actionsMenuIcon()"
        ></p-button>
      </section>
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
            <td
              [class]="{ 'line-through': todo.status === TodoStatus.NUMBER_2 }"
            >
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
    </p-card>
  `,
  styles: ``,
  providers: [TodosService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTable {
  readonly todos = input<TodoResponseDto[]>([]);
  selectedTodos = signal<TodoResponseDto[]>([]);
  readonly deleteTodo = output<TodoResponseDto>();
  readonly updateTodo = output<{
    todo: TodoResponseDto;
    type: 'complete' | 'reopen';
  }>();
  readonly tableActionSelected = output<{
    action: TodoTableMenuActions;
    todos: TodoResponseDto[];
  }>();
  readonly TodoStatus = TodoStatus;
  readonly actionsMenuIcon = signal('pi pi-chevron-right');
  readonly items = computed<MenuItem[]>(() => {
    return [
      {
        label: 'Complete selected items',
        icon: 'pi pi-check',
        command: () => {
          alert('Complete selected items');
        },
        disabled: this.selectedTodos().length === 0,
        tooltip:
          this.selectedTodos().length === 0 ? 'Select items to complete' : '',
      },
      {
        label: 'Reopen selected items',
        icon: 'pi pi-undo',
        command: () => {
          alert('Reopen selected items');
        },
        disabled: this.selectedTodos().length === 0,
        tooltip:
          this.selectedTodos().length === 0 ? 'Select items to reopen' : '',
      },
      {
        label: 'Delete selected items',
        icon: 'pi pi-trash',
        command: () => {
          this.tableActionSelected.emit({
            action: 'delete_many',
            todos: this.selectedTodos(),
          });
        },
        disabled: this.selectedTodos().length === 0,
        tooltip:
          this.selectedTodos().length === 0 ? 'Select items to delete' : '',
      },
    ];
  });
}
