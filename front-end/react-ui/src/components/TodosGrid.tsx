import { useState } from 'react';
import TodoActionButton from './TodoActionButton';
import TodoStatusPill from './TodoStatusPill';

export type GridFilterKey =
  | 'all'
  | 'incomplete'
  | 'in_progress'
  | 'complete'
  | 'undone';
export type FilterOptions = {
  key: GridFilterKey;
  label: string;
};

export default function TodosTable() {
  const [gridFilter, setGridFilter] = useState<GridFilterKey>('all');
  const filterOptions: FilterOptions[] = [
    { key: 'all', label: 'All To-Dos' },
    { key: 'undone', label: 'Incomplete & In Progress' },
    { key: 'incomplete', label: 'Incomplete' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'complete', label: 'Complete' },
  ];

  const todos = [
    {
      id: 1,
      text: 'Buy groceries',
      createdAt: '2024-05-20T12:00:00Z',
      status: 'incomplete',
    },
    {
      id: 2,
      text: 'Complete blog post',
      createdAt: '2024-05-20T12:00:00Z',
      status: 'in_progress',
    },
    {
      id: 3,
      text: 'Build API for app',
      createdAt: '2024-05-20T12:00:00Z',
      status: 'complete',
    },
  ];

  const displayedTodos = todos.filter((todo) => {
    switch (gridFilter) {
      case 'all':
        return true;
      case 'incomplete':
        return todo.status === 'incomplete';
      case 'in_progress':
        return todo.status === 'in_progress';
      case 'complete':
        return todo.status === 'complete';
      case 'undone':
        return todo.status === 'incomplete' || todo.status === 'in_progress';
      default:
        return true;
    }
  });

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 lg:flex lg:items-center lg:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My To-Dos
              </h2>

              <div className="mt-6 gap-4 space-y-4 sm:flex sm:items-center sm:space-y-0 lg:mt-0 lg:justify-end">
                <div>
                  <label
                    htmlFor="grid-filter"
                    className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select order type
                  </label>
                  <select
                    defaultValue={gridFilter}
                    onChange={(e) =>
                      setGridFilter(e.target.value as GridFilterKey)
                    }
                    id="grid-filter"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:w-[144px]"
                  >
                    {filterOptions.map((option) => (
                      <option key={option.key} value={option.key}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* <button type="button" className="w-full rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300   dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto">Add To-Do</button> */}
              </div>
            </div>

            <div className="mt-6 flow-root sm:mt-8">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {displayedTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="relative grid grid-cols-2 gap-4 py-6 sm:grid-cols-4 lg:grid-cols-5"
                  >
                    <div className="col-span-2 content-center sm:col-span-4 lg:col-span-2">
                      <span className="text-base font-semibold text-gray-900 dark:text-white">
                        {todo.text}
                      </span>
                    </div>

                    <div className="content-center">
                      <div className="flex items-center gap-2 lg:justify-center">
                        <svg
                          className="h-4 w-4 text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z"
                          />
                        </svg>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {todo.createdAt}
                        </p>
                      </div>
                    </div>

                    <TodoStatusPill status={todo.status} />

                    <div className="col-span-2 content-center sm:col-span-1 sm:justify-self-end">
                      <TodoActionButton todo={todo} />
                      {/* <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">Mark complete</button> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
