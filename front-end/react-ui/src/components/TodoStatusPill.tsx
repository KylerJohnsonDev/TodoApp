export default function TodoStatusPill({ status }: { status: string }) {
  const pillBaseClasses = "inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium"

  const pillColorClassesByStatus: Record<string, string> = {
    incomplete: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    complete: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }

  const pillColorBasedOnStatus = pillColorClassesByStatus[status] ?? pillBaseClasses['incomplete'];
  const pillClasses = `${pillBaseClasses} ${pillColorBasedOnStatus}`

  const getSvgIcon = (status) => {
    switch (status) {
      case 'complete':
        return (
          <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11.917 9.724 16.5 19 7.5" />
          </svg>
        )
      default: 
        return (
          <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z" />
          </svg>
        )
    }
  }

  return <>
    <div className="absolute right-0 top-7 content-center sm:relative sm:right-auto sm:top-auto lg:flex lg:items-center lg:justify-center">
      <span className={pillClasses}>
        {getSvgIcon(status)}
        {status.replace('_', ' ').toUpperCase()}
      </span>
    </div>
  </>
}