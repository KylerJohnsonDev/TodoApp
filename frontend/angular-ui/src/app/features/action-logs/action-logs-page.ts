import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActionLogsService } from '../../__generated__/todoAPI/action-logs/action-logs.service';
import ActionLogsTable from './action-logs-table';
import { actionLogsStore } from './action-logs.store';

@Component({
  selector: 'app-action-logs-page',
  imports: [ActionLogsTable],
  template: `
    <app-action-logs-table
      [actionLogs]="actionLogsStore.actionLogs()"
      [page]="actionLogsStore.pageIndex()"
      [pageSize]="actionLogsStore.pageSize()"
      [pageSizeOptions]="actionLogsStore.pageSizeOptions()"
      [totalItems]="actionLogsStore.totalCount()"
      (pageChange)="actionLogsStore.handleTablePageEvent($event)"
    />
  `,
  host: {
    class: 'grow flex flex-col',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActionLogsService, actionLogsStore],
})
export default class ActionLogsPage {
  readonly actionLogsStore = inject(actionLogsStore);

  readonly actionLogsRequestParams = computed(() => ({
    pageIndex: this.actionLogsStore.pageIndex(),
    pageSize: this.actionLogsStore.pageSize(),
  }));

  constructor() {
    this.actionLogsStore.fetchActionLogsForUser(this.actionLogsRequestParams);
  }
}
