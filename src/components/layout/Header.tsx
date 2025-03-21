/**
 * ⚠️ WARNING: DO NOT MODIFY THIS FILE ⚠️
 * This component has been carefully optimized and styled.
 * Any modifications may break the layout and functionality.
 * If changes are needed, please consult the team first.
 */

'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center">
              <span className="sr-only">Open user menu</span>
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-base font-semibold text-white ring-2 ring-white hover:bg-indigo-700 transition-colors duration-200">
                {userInitial}
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Connecté en tant que</p>
                  <p className="truncate text-sm font-medium text-gray-900">{session?.user?.name || session?.user?.email}</p>
                </div>
                <div className="py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/profile"
                        className={`
                          group flex items-center px-4 py-2 text-sm transition-colors duration-150
                          ${active ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}
                        `}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
                        Votre Profil
                      </Link>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-2 border-t border-gray-100">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`
                          group flex w-full items-center px-4 py-2 text-sm transition-colors duration-150
                          ${active ? 'bg-red-50 text-red-700' : 'text-red-600 hover:bg-red-50 hover:text-red-700'}
                        `}
                      >
                        <svg className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Se déconnecter
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
} 