'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, BuildingOfficeIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Entreprises', href: '/entreprises', icon: BuildingOfficeIcon },
  { name: 'Clients', href: '/clients', icon: UserGroupIcon },
  { name: 'Factures', href: '/factures', icon: DocumentTextIcon },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-10 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center gap-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">ProComptable</span>
              <span className="text-xs text-gray-500">Gestion comptable</span>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                          ${isActive
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                          }
                        `}
                      >
                        <item.icon
                          className={`h-6 w-6 shrink-0 ${
                            isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                          }`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="flex flex-col gap-y-4">
                <div className="text-xs font-semibold leading-6 text-gray-400">
                  Version 1.0.0
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
} 