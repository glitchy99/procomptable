'use client';

import {
  DocumentPlusIcon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

const stats = [
  { name: 'Factures ce mois', stat: '12', change: '12%', changeType: 'increase' },
  { name: 'Revenus (MAD)', stat: '45,000', change: '2.1%', changeType: 'increase' },
  { name: 'Dépenses (MAD)', stat: '23,000', change: '4.3%', changeType: 'decrease' },
];

const quickActions = [
  {
    name: 'Nouvelle Facture',
    description: 'Créer une nouvelle facture',
    href: '/factures/nouveau',
    icon: DocumentPlusIcon,
  },
  {
    name: 'Calculateur',
    description: 'Accéder aux outils de calcul',
    href: '/outils',
    icon: CalculatorIcon,
  },
  {
    name: 'Assistant Virtuel',
    description: 'Poser une question comptable',
    href: '/assistant',
    icon: ChatBubbleLeftRightIcon,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Bienvenue, {session?.user?.name || 'Utilisateur'}
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nouvelle Facture
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                {item.changeType === 'increase' ? (
                  <ArrowUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
                ) : (
                  <ArrowDownIcon className="h-6 w-6 text-white" aria-hidden="true" />
                )}
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
              <p
                className={classNames(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Actions rapides</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <a
              key={action.name}
              href={action.href}
              className="relative block rounded-lg border border-gray-300 bg-white p-6 hover:border-gray-400 hover:ring-1 hover:ring-gray-400"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <action.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <p className="text-base font-medium text-gray-900">{action.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 