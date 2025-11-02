import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TodoResponseDto } from '../__generated__/todoAPI/todoApi.schemas';

@Component({
  selector: 'app-todo',
  imports: [DatePipe, MatButtonModule, MatIcon],
  template: `
    <div class="flex flex-col gap-2 py-4">
      <p class="text-lg font-semibold">{{ todo()?.text }}</p>
      <div
        class="flex flex-col gap-2 text-sm md:flex-row md:gap-4 md: md:items-center"
      >
        <span>{{ todo()?.status }}</span>
        <!-- <span>Created: {{ todo()?.created_at | date: 'short' }}</span>
        <span>Updated: {{ todo()?.updated_at | date: 'short' }}</span> -->
        <button mat-button color="warn">
          <mat-icon>check</mat-icon>
          Mark Complete
        </button>
        <button mat-button class="warn" color="warn">
          <mat-icon>delete</mat-icon>
          Delete
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Todo {
  readonly todo = input<TodoResponseDto>();
}
