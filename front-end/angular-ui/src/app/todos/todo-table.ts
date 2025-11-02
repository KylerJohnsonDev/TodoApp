import { SelectionModel } from '@angular/cdk/collections';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  TodoResponseDto,
  TodoStatus,
} from '../__generated__/todoAPI/todoApi.schemas';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

@Component({
  selector: 'app-todo-table',
  imports: [
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  styles: [
    `
      .table-container {
        max-height: 500px;
        overflow: auto;
        border-radius: 8px;
      }

      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .status-complete {
        background-color: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      }

      .status-incomplete,
      .status-inprogress {
        background-color: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header class="flex justify-between gap-2 items-center mb-2">
        <mat-card-title>
          <h3 class="text-2xl">
            {{ todos().length }} Total
            @if (selection().selected.length > 0) {
              ({{ selection().selected.length }} Selected)
            }
          </h3>
        </mat-card-title>
        <button mat-flat-button [matMenuTriggerFor]="menu">
          <mat-icon>menu</mat-icon>
          Actions
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="onClickDeleteMultiple()">
            <mat-icon>delete</mat-icon>
            <span>Delete selected</span>
          </button>
        </mat-menu>
      </mat-card-header>
      <mat-card-content>
        <div class="table-container">
          <table
            mat-table
            [dataSource]="todoTableDataSource()"
            class="mat-elevation-z8"
          >
            <!-- Checkbox Column -->
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>
                <mat-checkbox
                  (change)="$event ? toggleAllRows(isAllSelected()) : null"
                  [checked]="selection().hasValue() && isAllSelected()"
                  [indeterminate]="selection().hasValue() && !isAllSelected()"
                  [aria-label]="checkboxLabel()"
                >
                </mat-checkbox>
              </th>
              <td mat-cell *matCellDef="let row">
                <mat-checkbox
                  (click)="$event.stopPropagation()"
                  (change)="$event ? selection().toggle(row) : null"
                  [checked]="selection().isSelected(row)"
                  [aria-label]="checkboxLabel(row)"
                >
                </mat-checkbox>
              </td>
            </ng-container>

            <!-- Text Column -->
            <ng-container matColumnDef="text">
              <th mat-header-cell *matHeaderCellDef>Task</th>
              <td mat-cell *matCellDef="let element">{{ element.text }}</td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let element">
                <span
                  class="status-badge"
                  [class]="{
                    'status-incomplete': element.status === 'Incomplete',
                    'status-inprogress': element.status === 'InProgress',
                    'status-complete': element.status === 'Complete',
                  }"
                >
                  {{ element.status }}
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <div class="flex gap-2">
                  <button
                    matTooltip="Delete task"
                    mat-icon-button
                    (click)="onClickDeleteTodo($event, element)"
                  >
                    <mat-icon>delete</mat-icon>
                  </button>
                  @if (
                    element.status === 'Incomplete' ||
                    element.status === 'InProgress'
                  ) {
                    <button
                      matTooltip="Mark as complete"
                      mat-icon-button
                      (click)="
                        onClickUpdateTodoStatus($event, element, 'complete')
                      "
                    >
                      <mat-icon>check_circle</mat-icon>
                    </button>
                  }
                  @if (element.status === 'Complete') {
                    <button
                      matTooltip="Reopen task"
                      mat-icon-button
                      (click)="
                        onClickUpdateTodoStatus($event, element, 'reopen')
                      "
                    >
                      <mat-icon>replay</mat-icon>
                    </button>
                  }
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              (click)="selection().toggle(row)"
            ></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoTable {
  private readonly dialog = inject(MatDialog);

  readonly displayedColumns = ['select', 'text', 'status', 'actions'];
  readonly todos = input.required<TodoResponseDto[]>();
  readonly todoTableDataSource = computed(() => {
    return new MatTableDataSource<TodoResponseDto>(this.todos());
  });
  readonly selection = signal<SelectionModel<TodoResponseDto>>(
    new SelectionModel<TodoResponseDto>(true, []),
  );
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

  readonly isAllSelected = computed(() => {
    const numSelected = this.selection().selected.length;
    const numRows = this.todoTableDataSource().data.length;
    const isAllSelected = numSelected === numRows;
    return isAllSelected;
  });

  toggleAllRows(isAllSelected: boolean): void {
    console.log(isAllSelected);
    if (isAllSelected) {
      this.selection.set(new SelectionModel<TodoResponseDto>(true, []));
      return;
    }

    this.selection.set(
      new SelectionModel<TodoResponseDto>(
        true,
        this.todoTableDataSource().data,
      ),
    );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TodoResponseDto): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection().isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  onClickDeleteTodo(event: MouseEvent, todo: TodoResponseDto): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      data: {
        type: 'single' as const,
        todoText: todo.text,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteTodo.emit(todo);
      }
    });
  }

  onClickDeleteMultiple(): void {
    const selectedTodos = this.selection().selected;

    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      data: {
        type: 'multiple' as const,
        todoCount: selectedTodos.length,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteMultipleTodos.emit(selectedTodos);
        this.selection.set(new SelectionModel<TodoResponseDto>(true, []));
      }
    });
  }

  onClickUpdateTodoStatus(
    $event: MouseEvent,
    todo: TodoResponseDto,
    type: 'complete' | 'reopen',
  ): void {
    $event.stopPropagation();
    this.updateTodo.emit({ todo, type });
  }
}
