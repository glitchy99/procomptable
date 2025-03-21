'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  FolderIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

function SidebarLink({ href, name, Icon, isActive }: { href: string; name: string; Icon: React.ComponentType<any>; isActive: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`mr-3 h-6 w-6 ${
          isActive
            ? 'text-gray-500'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
        aria-hidden="true"
      />
      {name}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link href="/dashboard" className="text-xl font-semibold text-gray-800">
              ProComptable
            </Link>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <SidebarLink
              href="/dashboard"
              name="Tableau de bord"
              Icon={HomeIcon}
              isActive={pathname === '/dashboard'}
            />
            <SidebarLink
              href="/clients"
              name="Clients"
              Icon={UserGroupIcon}
              isActive={pathname === '/clients'}
            />
            <SidebarLink
              href="/factures"
              name="Factures"
              Icon={DocumentTextIcon}
              isActive={pathname === '/factures'}
            />
            <SidebarLink
              href="/outils"
              name="Outils comptables"
              Icon={CalculatorIcon}
              isActive={pathname === '/outils'}
            />
            <SidebarLink
              href="/assistant"
              name="Assistant virtuel"
              Icon={ChatBubbleLeftRightIcon}
              isActive={pathname === '/assistant'}
            />
            <SidebarLink
              href="/documents"
              name="Documents"
              Icon={FolderIcon}
              isActive={pathname === '/documents'}
            />
            <SidebarLink
              href="/analyses"
              name="Analyses"
              Icon={ChartBarIcon}
              isActive={pathname === '/analyses'}
            />
          </nav>
        </div>
      </div>
    </div>
  );
} 