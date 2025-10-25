import {
  setError,
  setLoaded,
  setLoading,
  withCallState,
} from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { ActionLogsService } from '../__generated__/todoAPI/action-logs/action-logs.service';
import { ActionLogsResponseDto } from '../__generated__/todoAPI/todoApi.schemas';

const ACTION_LOGS_USER_KEY = 'action_logs_user';
const ACTION_LOGS_ALL_KEY = 'action_logs_all';

interface ActionLogsState {
  actionLogsResponse: ActionLogsResponseDto;
  page: number;
  pageSize: number;
  pageSizeOptions: number[];
}

const initialActionLogsState: ActionLogsState = {
  actionLogsResponse: {
    action_logs: [],
    total_count: 0,
    is_last_page: true,
  },
  page: 1,
  pageSize: 25,
  pageSizeOptions: [25, 50, 100],
};

export const actionLogsStore = signalStore(
  withState<ActionLogsState>(initialActionLogsState),
  withCallState({ collections: [ACTION_LOGS_USER_KEY, ACTION_LOGS_ALL_KEY] }),
  withComputed((state) => ({
    actionLogs: computed(() => state.actionLogsResponse().action_logs ?? []),
    totalCount: computed(() => state.actionLogsResponse().total_count ?? 0),
    isLastPage: computed(() => state.actionLogsResponse().is_last_page ?? true),
  })),
  withMethods((store, actionLogsService = inject(ActionLogsService)) => ({
    fetchActionLogsForUser: rxMethod<{ page: number; pageSize: number }>(
      pipe(
        switchMap(({ page, pageSize }) => {
          patchState(store, setLoading(ACTION_LOGS_USER_KEY));
          return actionLogsService
            .getUserActionLogs({
              page,
              pageSize,
            })
            .pipe(
              tapResponse({
                next: (response) => {
                  patchState(store, setLoaded(ACTION_LOGS_USER_KEY), {
                    actionLogsResponse: response,
                  });
                },
                error: (error: HttpErrorResponse) => {
                  const errorMessage = `Error fetching action logs for user: ${error.message}`;
                  patchState(
                    store,
                    setError(errorMessage, ACTION_LOGS_USER_KEY),
                  );
                },
              }),
            );
        }),
      ),
    ),
  })),
);
