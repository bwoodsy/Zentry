import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Projects', href: '/projects' },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function NavLinks({ location, mobile = false }) {
  return navigation.map((item) => {
    const isActive = location.pathname === item.href
    const baseClasses = mobile
      ? 'block rounded-md px-4 py-2 text-base transition-all duration-150'
      : 'rounded-md px-4 py-2 text-base transition-all duration-150'
    const activeClasses = mobile
      ? 'text-indigo-700 font-semibold border-l-4 border-indigo-600 bg-indigo-50'
      : 'text-indigo-700 font-semibold border-b-2 border-indigo-600 bg-indigo-50'
    const inactiveClasses = 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-50'
    return (
      <Link
        key={item.name}
        to={item.href}
        className={classNames(
          isActive ? activeClasses : inactiveClasses,
          baseClasses
        )}
      >
        {item.name}
      </Link>
    )
  })
}

function UserMenu() {
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="flex max-w-xs items-center rounded-full bg-indigo-100 hover:bg-indigo-200 transition p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <span className="sr-only">Open user menu</span>
          <img
            className="h-9 w-9 rounded-full border-2 border-indigo-300"
            src={user.imageUrl}
            alt={user.name}
          />
        </MenuButton>
      </div>
      <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="font-semibold text-gray-800">{user.name}</div>
          <div className="text-xs text-gray-400">{user.email}</div>
        </div>
        {userNavigation.map((item) => (
          <MenuItem key={item.name}>
            {({ active }) => (
              <Link
                to={item.href}
                className={classNames(
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700',
                  'block px-4 py-2 text-sm rounded transition'
                )}
              >
                {item.name}
              </Link>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}

export default function Navbar() {
  const location = useLocation()

  return (
    <header>
      <nav className="bg-white shadow-md rounded-b-2xl">
        <Disclosure>
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2">
                      <img
                        className="h-9 w-9"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Company Logo"
                      />
                      <span className="text-xl font-extrabold text-indigo-700 tracking-tight">Zentry</span>
                    </Link>
                    <div className="hidden md:flex ml-10 items-baseline space-x-2">
                      <NavLinks location={location} />
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-4">
                    <button
                      type="button"
                      className="relative rounded-full bg-indigo-500 text-white p-2 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      aria-label="View notifications"
                    >
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      <span className="absolute -top-1 -right-1 inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </button>
                    <UserMenu />
                  </div>
                  {/* Mobile menu button */}
                  <div className="flex md:hidden">
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>
              <DisclosurePanel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  <NavLinks location={location} mobile />
                </div>
                <div className="border-t border-gray-100 pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <img
                      className="h-10 w-10 rounded-full border-2 border-indigo-300"
                      src={user.imageUrl}
                      alt={user.name}
                    />
                    <div className="ml-3">
                      <div className="text-base font-medium text-indigo-900">{user.name}</div>
                      <div className="text-sm font-medium text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as={Link}
                        to={item.href}
                        className="block rounded-md px-4 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </div>
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </nav>
    </header>
  )
}
