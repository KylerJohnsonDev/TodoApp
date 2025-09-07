import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-todo-form',
  imports: [InputTextModule, FormsModule, CardModule, ButtonModule],
  template: `
    <p-card>
      <div class="card-content-wrapper">
        <input
          pInputText
          [(ngModel)]="todoText"
          type="text"
          pSize="large"
          placeholder="Type new to-do and hit Enter"
        />
        <p-button
          label="Add"
          severity="success"
          (click)="submitNewTodo.emit(todoText)"
        />
      </div>
    </p-card>
  `,
  styles: `
    .card-content-wrapper {
      display: flex;
      gap: 1rem;
      align-items: center;
      input {
        flex: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  readonly submitNewTodo = output<string>();
  todoText = '';
}
