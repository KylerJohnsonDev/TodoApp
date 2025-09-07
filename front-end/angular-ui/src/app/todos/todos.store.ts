import {
  setError,
  setLoaded,
  setLoading,
  withCallState,
} from '@angular-architects/ngrx-toolkit';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap } from 'rxjs';
import { TodoResponseDto } from '../__generated__/todoAPI/todoApi.schemas';
import { TodosService } from '../__generated__/todoAPI/todos/todos.service';

const FETCH_TODOS_KEY = 'FETCH_TODOS_KEY';
const CREATE_TODO_KEY = 'CREATE_TODO_KEY';
const DELETE_TODO_KEY = 'DELETE_TODO_KEY';
const DELETE_MANY_TODOS_KEY = 'DELETE_MANY_TODOS_KEY';

interface TodosState {
  todos: TodoResponseDto[];
}

const initialTodosState: TodosState = {
  todos: [],
};

export const todosStore = signalStore(
  withState<TodosState>(initialTodosState),
  withCallState({
    collections: [
      FETCH_TODOS_KEY,
      CREATE_TODO_KEY,
      DELETE_TODO_KEY,
      DELETE_MANY_TODOS_KEY,
    ],
  }),
  withMethods((store, todosService = inject(TodosService)) => ({
    fetchTodos: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, setLoading(FETCH_TODOS_KEY));
          return todosService.getTodos().pipe(
            tapResponse({
              next: (todos): void => {
                patchState(store, setLoaded(FETCH_TODOS_KEY), { todos });
              },
              error: (error: HttpErrorResponse): void => {
                const friendlyMessage = `Error fetching todos.`;
                console.error(`${friendlyMessage} Details:`, error);
                patchState(store, setError(friendlyMessage, FETCH_TODOS_KEY));
              },
            }),
          );
        }),
      ),
    ),
    createTodo: rxMethod<{ text: string }>(
      pipe(
        concatMap((todoText) => {
          patchState(store, setLoading(CREATE_TODO_KEY));
          return todosService.createTodo({ text: todoText.text }).pipe(
            tapResponse({
              next: (newTodo): void => {
                const currentTodos = store.todos();
                const newTodos = currentTodos.splice(0, 0, newTodo);
                patchState(store, setLoaded(CREATE_TODO_KEY), {
                  todos: newTodos,
                });
              },
              error: (error: HttpErrorResponse): void => {
                const friendlyMessage = `Error creating todo "${todoText.text}".`;
                console.error(`${friendlyMessage} Details:`, error);
                patchState(store, setError(friendlyMessage, CREATE_TODO_KEY));
              },
            }),
          );
        }),
      ),
    ),
  })),
);
