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
import { MessageService } from 'primeng/api';
import { concatMap, pipe, switchMap } from 'rxjs';
import {
  DeleteMultipleTodosDto,
  TodoResponseDto,
  TodoStatus,
  UpdateTodoDto,
} from '../__generated__/todoAPI/todoApi.schemas';
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
  withMethods(
    (
      store,
      todosService = inject(TodosService),
      messageService = inject(MessageService),
    ) => {
      const fetchTodos = rxMethod<void>(
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
      );
      const createTodo = rxMethod<string>(
        pipe(
          concatMap((todoText) => {
            patchState(store, setLoading(CREATE_TODO_KEY));
            return todosService.createTodo({ text: todoText }).pipe(
              tapResponse({
                next: (newTodo): void => {
                  const currentTodos = [...store.todos()];
                  currentTodos.splice(0, 0, newTodo);

                  patchState(store, setLoaded(CREATE_TODO_KEY), {
                    todos: currentTodos,
                  });
                  messageService.add({
                    severity: 'success',
                    summary: 'To-Do Created',
                    detail: `Created to-do "${newTodo.text}"`,
                  });
                },
                error: (error: HttpErrorResponse): void => {
                  const friendlyMessage = `Error creating todo "${todoText}".`;
                  console.error(`${friendlyMessage} Details:`, error);
                  patchState(store, setError(friendlyMessage, CREATE_TODO_KEY));
                },
              }),
            );
          }),
        ),
      );
      const deleteTodo = rxMethod<TodoResponseDto>(
        pipe(
          concatMap((todo) => {
            return todosService.deleteTodo(todo.id).pipe(
              tapResponse({
                next: (): void => {
                  const currentTodos = store
                    .todos()
                    .filter((t) => t.id !== todo.id);
                  patchState(store, setLoaded(DELETE_TODO_KEY), {
                    todos: currentTodos,
                  });
                  messageService.add({
                    severity: 'success',
                    summary: 'To-Do Deleted',
                    detail: `Deleted to-do "${todo.text}"`,
                  });
                },
                error: (error: HttpErrorResponse): void => {
                  const friendlyMessage = `Error deleting todo "${todo.text}".`;
                  console.error(`${friendlyMessage} Details:`, error);
                  messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: friendlyMessage,
                  });
                },
              }),
            );
          }),
        ),
      );
      const updateTodo = rxMethod<{
        todo: TodoResponseDto;
        type: 'complete' | 'reopen';
      }>(
        pipe(
          concatMap(({ todo, type }) => {
            const updateTodoDto: UpdateTodoDto = {
              status:
                type === 'complete'
                  ? TodoStatus.Complete
                  : TodoStatus.InProgress,
              text: todo.text,
            };
            return todosService.updateTodo(todo.id, updateTodoDto).pipe(
              tapResponse({
                next: (updatedTodo): void => {
                  const currentTodos = [...store.todos()];
                  const index = currentTodos.findIndex(
                    (t) => t.id === updatedTodo.id,
                  );
                  currentTodos.splice(index, 1, updatedTodo);
                  patchState(store, {
                    todos: currentTodos,
                  });

                  messageService.add({
                    severity: 'success',
                    summary: 'To-Do Updated',
                    detail: `${type === 'complete' ? 'Completed' : 'Reopened'} to-do "${updatedTodo.text}"`,
                  });
                },
                error: (error: HttpErrorResponse): void => {
                  const friendlyMessage = `Error updating todo "${todo.text}".`;
                  console.error(`${friendlyMessage} Details:`, error);
                  messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: friendlyMessage,
                  });
                },
              }),
            );
          }),
        ),
      );
      const deleteMultipleTodos = rxMethod<TodoResponseDto[]>(
        pipe(
          concatMap((todos: TodoResponseDto[]) => {
            const deleteMultipleTodosDto: DeleteMultipleTodosDto = {
              todo_ids: todos.map((t) => t.id),
            };
            return todosService
              .deleteMultipleTodos(deleteMultipleTodosDto)
              .pipe(
                tapResponse({
                  next: (): void => {
                    const currentTodos = store
                      .todos()
                      .filter((t) => !todos.includes(t));
                    patchState(store, setLoaded(DELETE_TODO_KEY), {
                      todos: currentTodos,
                    });
                    messageService.add({
                      severity: 'success',
                      summary: 'To-Dos Deleted',
                      detail: `Deleted ${todos.length} to-dos`,
                    });
                  },
                  error: (error: HttpErrorResponse): void => {
                    const friendlyMessage = `Error deleting multiple to-dos.`;
                    console.error(`${friendlyMessage} Details:`, error);
                    messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: friendlyMessage,
                    });
                  },
                }),
              );
          }),
        ),
      );
      return {
        fetchTodos,
        createTodo,
        deleteTodo,
        updateTodo,
        deleteMultipleTodos,
      };
    },
  ),
);
