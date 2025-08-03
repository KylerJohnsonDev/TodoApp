import Button from "./ui/Button";

export type TodoActionButtonProps = {
  todo: any; // Replace 'any' with the actual type of your todo object
  onComplete?: () => void; // Function to call when the todo is marked complete
  onInProgress?: () => void; // Function to call when the todo is edited
  onMarkIncomplete?: () => void; // Function to call when the todo is deleted
  onDelete?: () => void; // Function to call when the todo is deleted
}

export default function TodoActionButton (props: TodoActionButtonProps) {

  const actions = [
    { label: 'Mark complete', onClick: props.onComplete },
    { label: 'Mark in progress', onClick: props.onInProgress },
    { label: 'Mark incomplete', onClick: props.onMarkIncomplete },
    { label: 'Delete', onClick: props.onDelete },
  ]

  return (
    <>
      <button id={`dropdownDefaultButton-${props.todo.id}`} data-dropdown-toggle={`dropdown-${props.todo.id}`} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 flex items-center" type="button">
        <span className="grow">Actions</span>
        <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
      </button>

      <div id={`dropdown-${props.todo.id}`} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
          {actions.map((action) => (
            <li key={action.label}>
              <span
                className="block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={action.onClick}
              >
                {action.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}