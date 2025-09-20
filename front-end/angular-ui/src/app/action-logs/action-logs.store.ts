import {
  setError,
  setLoaded,
  setLoading,
  withCallState,
} from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { of, pipe, switchMap } from 'rxjs';
import { getGetAllActionLogsResponseMock } from '../__generated__/todoAPI/action-logs/action-logs.msw';
import { ActionLogsResponseDto } from '../__generated__/todoAPI/todoApi.schemas';

const ACTION_LOGS_USER_KEY = 'action_logs_user';
const ACTION_LOGS_ALL_KEY = 'action_logs_all';

interface ActionLogsState {
  actionLogs: ActionLogsResponseDto[];
}

const initialActionLogsState: ActionLogsState = {
  actionLogs: [],
};

export const actionLogsStore = signalStore(
  withState<ActionLogsState>(initialActionLogsState),
  withCallState({ collections: [ACTION_LOGS_USER_KEY, ACTION_LOGS_ALL_KEY] }),
  withMethods((store) => ({
    fetchActionLogsForUser: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, setLoading(ACTION_LOGS_USER_KEY));
          return of(getGetAllActionLogsResponseMock()).pipe(
            tapResponse({
              next: (actionLogs) => {
                patchState(store, setLoaded(ACTION_LOGS_USER_KEY), {
                  actionLogs: [actionLogs],
                });
              },
              error: (error: HttpErrorResponse) => {
                const errorMessage = `Error fetching action logs for user: ${error.message}`;
                patchState(store, setError(errorMessage, ACTION_LOGS_USER_KEY));
              },
            }),
          );
        }),
      ),
    ),
  })),
);
