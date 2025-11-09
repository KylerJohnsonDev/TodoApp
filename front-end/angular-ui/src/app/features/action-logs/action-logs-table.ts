import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActionLogDto } from '../../__generated__/todoAPI/todoApi.schemas';

@Component({
  selector: 'app-action-logs-table',
  imports: [
    DatePipe,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
  ],
  template: `
    <h3 class="text-2xl mb-4">Actions Logs</h3>
    <div class="grow border-1 rounded-2xl" #tableWrapper>
      <div
        class="grow overflow-auto rounded-t-2xl border-b-1"
        [style.height]="tableCardContentHeight()"
      >
        <table
          mat-table
          [dataSource]="actionLogTableDataSource()"
          class="mat-elevation-z8 w-full rounded-2xl"
        >
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <!-- Username Column -->
          <ng-container matColumnDef="username">
            <th mat-header-cell *matHeaderCellDef>Username</th>
            <td mat-cell *matCellDef="let element">
              {{ element.username || 'Unknown' }}
            </td>
          </ng-container>

          <!-- Action Column -->
          <ng-container matColumnDef="action">
            <th mat-header-cell *matHeaderCellDef>Action</th>
            <td mat-cell *matCellDef="let element">
              {{ element.action || 'N/A' }}
            </td>
          </ng-container>

          <!-- Timestamp Column -->
          <ng-container matColumnDef="timestamp">
            <th mat-header-cell *matHeaderCellDef>Timestamp</th>
            <td mat-cell *matCellDef="let element">
              {{ element.timestamp | date: 'medium' }}
            </td>
          </ng-container>

          <tr
            mat-header-row
            *matHeaderRowDef="displayedColumns; sticky: true"
          ></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>
      <mat-paginator
        [length]="totalItems()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="pageSizeOptions()"
        [pageIndex]="page()"
        (page)="onPageChange($event)"
        showFirstLastButtons
        class="mt-4"
      ></mat-paginator>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col grow',
  },
})
export default class ActionLogsTable {
  readonly actionLogs = input.required<ActionLogDto[]>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input.required<number[]>();
  readonly totalItems = input.required<number>();

  readonly pageChange = output<PageEvent>();

  readonly displayedColumns = ['timestamp', 'action', 'username'];

  readonly actionLogTableDataSource = computed(() => {
    return new MatTableDataSource<ActionLogDto>(this.actionLogs());
  });

  readonly tableWrapperElementRef =
    viewChild<ElementRef<HTMLDivElement>>('tableWrapper');

  private readonly containerSize = signal<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  private resizeObserver: ResizeObserver | null = null;

  // Effect to set up ResizeObserver when element is available
  private readonly setupResizeObserver = effect(() => {
    const element = this.tableWrapperElementRef();

    if (element) {
      // Clean up existing observer
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }

      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          console.log({ width, height });
          this.containerSize.set({ width, height });
        }
      });

      this.resizeObserver.observe(element.nativeElement);

      const rect = element.nativeElement.getBoundingClientRect();
      this.containerSize.set({ width: rect.width, height: rect.height });
    }

    return () => {
      // Clean up ResizeObserver on effect teardown
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    };
  });

  readonly tableCardContentHeight = computed(() => {
    const size = this.containerSize();
    if (size.height > 0) {
      return size.height - 84 + 'px'; // Subtract padding
    }
    return '400px'; // Fallback height
  });

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
