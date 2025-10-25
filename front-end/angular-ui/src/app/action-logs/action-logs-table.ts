import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActionLogDto } from '../__generated__/todoAPI/todoApi.schemas';

@Component({
  selector: 'app-action-logs-table',
  imports: [DatePipe],
  template: ` action logs table `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grow',
  },
  styles: ``,
})
export default class ActionLogsTable {
  readonly actionLogs = input.required<ActionLogDto[]>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input.required<number[]>();
}
