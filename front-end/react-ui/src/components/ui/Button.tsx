export type ButtonProps = {
  id?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}

export default function Button ({ children, props }: { children: React.ReactNode, props: ButtonProps }) {

  const primaryClassNames="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  const secondaryClassNames="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
  let classNames = props.variant === 'secondary' ? secondaryClassNames : primaryClassNames;
  const disabledClassNames = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
  classNames += ` ${disabledClassNames}`;


  return (
    <button className={classNames} disabled={props.disabled} type={props.type || 'button'}>
      {children}
    </button>
  )
}
