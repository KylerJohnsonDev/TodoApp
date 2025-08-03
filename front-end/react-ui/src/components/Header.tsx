import { Link } from "@tanstack/react-router"

export default function Header() {

  const links = [
    { label: `To-Do's`, href: '/' },
    { label: 'Action Log', href: '/action-log' },
  ]

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 antialiased">
  <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
    <div className="flex items-center justify-between">

      <div className="flex items-center space-x-8">
        <div className="shrink-0">
          <Link to="/" title="My To-do's" className="flex items-center gap-2">
            <svg className="stroke-primary-500 dark:stroke-primary-300 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11 6L21 6.00072M11 12L21 12.0007M11 18L21 18.0007M3 11.9444L4.53846 13.5L8 10M3 5.94444L4.53846 7.5L8 4M4.5 18H4.51M5 18C5 18.2761 4.77614 18.5 4.5 18.5C4.22386 18.5 4 18.2761 4 18C4 17.7239 4.22386 17.5 4.5 17.5C4.77614 17.5 5 17.7239 5 18Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            <span className="font-extrabold text-2xl">To-Do App</span>
          </Link>
        </div>

        <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
          {links.map(link => (
            <li key={link.label} className="shrink-0">
              <Link to={link.href} title={link.label} className="[&.active]:font-bold flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500">
                { link.label }
              </Link>
            </li>
          )) }
        </ul>
      </div>

      <div className="flex items-center lg:space-x-2">

        <button id="userDropdownButton1" data-dropdown-toggle="userDropdown1" type="button" className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white">
          <svg className="w-5 h-5 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
          </svg>              
          Account
          <svg className="w-4 h-4 text-gray-900 dark:text-white ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/>
          </svg> 
        </button>

        <div id="userDropdown1" className="hidden z-10 w-56 divide-y divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700">
          <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
            <li><Link to="/account" title="My Account" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> My Account </Link></li>
          </ul>
      
          <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
            <a href="#" title="" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"> Sign Out </a>
          </div>
        </div>

        <button type="button" data-collapse-toggle="todos-navbar-menu-1" aria-controls="todos-navbar-menu-1" aria-expanded="false" className="inline-flex lg:hidden items-center justify-center hover:bg-gray-100 rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white">
          <span className="sr-only">
            Open Menu
          </span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
          </svg>                
        </button>
      </div>
    </div>

    <div id="todos-navbar-menu-1" className="bg-gray-50 dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4">
      <ul className="text-gray-900 dark:text-white text-sm font-medium space-y-3">
        { links.map(link => (
          <li key={link.href}>
            <a href={link.href} className="[&.active]:font-bold hover:text-primary-700 dark:hover:text-primary-500">{link.label}</a>
          </li>
        ))}     
      </ul>
    </div>
  </div>
</nav>
    </>
  )
}