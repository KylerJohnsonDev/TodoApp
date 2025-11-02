import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface DeleteConfirmationData {
  type: 'single' | 'multiple';
  todoText?: string;
  todoCount?: number;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <div mat-dialog-content>
      @if (data.type === 'single') {
        <p>Are you sure you want to delete this todo?</p>
        <p>
          <strong>"{{ data.todoText }}"</strong>
        </p>
      } @else {
        <p>
          Are you sure you want to delete {{ data.todoCount }} selected todos?
        </p>
      }
      <p>This action cannot be undone.</p>
    </div>
    <div mat-dialog-actions class="flex justify-end gap-2">
      <button mat-button [mat-dialog-close]="false">Cancel</button>
      <button mat-flat-button class="warn" [mat-dialog-close]="true">
        Delete
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationDialog {
  public dialogRef = inject(MatDialogRef<DeleteConfirmationDialog>);
  public data = inject(MAT_DIALOG_DATA) as DeleteConfirmationData;
}
