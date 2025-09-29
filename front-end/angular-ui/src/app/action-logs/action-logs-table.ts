import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ActionLogDto } from '../__generated__/todoAPI/todoApi.schemas';

@Component({
  selector: 'app-action-logs-table',
  imports: [CardModule, TableModule, ButtonModule, DatePipe],
  template: `
    <p-card class="grow flex flex-col">
      <p-table
        class="grow"
        [value]="actionLogs()"
        [tableStyle]="{ 'min-width': '50rem' }"
        [dataKey]="'id'"
        [scrollable]="true"
        scrollHeight="500px"
      >
        <ng-template #header>
          <tr>
            <th>Action</th>
            <th>Username</th>
            <th>Timestamp</th>
          </tr>
        </ng-template>
        <ng-template #body let-actionLog>
          <tr>
            <td>{{ actionLog.action }}</td>
            <td>{{ actionLog.username }}</td>
            <td>{{ actionLog.timestamp | date: 'short' }}</td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex',
  },
  styles: ``,
})
export default class ActionLogsTable {
  readonly actionLogs = input.required<ActionLogDto[]>();
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
}
