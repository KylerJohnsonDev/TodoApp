import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-todo-form',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="flex gap-2">
      <mat-form-field class="grow">
        <input
          matInput
          [(ngModel)]="todoText"
          type="text"
          placeholder="Type new to-do and hit Enter"
          (keydown.enter)="submitTodo()"
        />
      </mat-form-field>
      <button matFab (click)="submitTodo()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  readonly isLoading = input<boolean>(false);
  readonly submitNewTodo = output<string>();
  todoText = '';

  submitTodo(): void {
    this.submitNewTodo.emit(this.todoText);
    this.todoText = '';
  }
}
