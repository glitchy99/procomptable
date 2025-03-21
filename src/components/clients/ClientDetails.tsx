'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  ClockIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: string;
  total: number;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  taxId: string | null;
  createdAt: string;
  updatedAt: string;
  invoices: Invoice[];
}

interface ClientDetailsProps {
  client: Client;
}

export default function ClientDetails({ client }: ClientDetailsProps) {
  const router = useRouter();
  
  // Calculate client statistics
  const stats = {
    totalInvoices: client.invoices.length,
    totalRevenue: client.invoices.reduce((sum, inv) => sum + inv.total, 0),
    averagePaymentTime: 15, // This should be calculated based on actual payment dates
    outstandingAmount: client.invoices
      .filter((inv) => inv.status === 'SENT' || inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + inv.total, 0),
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-400 hover:text-gray-500"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
        </div>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            onClick={() => router.push(`/clients/${client.id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Modifier
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Informations générales</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Adresse</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">N° Fiscal</dt>
              <dd className="mt-1 text-sm text-gray-900">{client.taxId}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques financières</h2>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                Total Factures
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.totalInvoices}
              </dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <CurrencyEuroIcon className="h-5 w-5 mr-2 text-gray-400" />
                Chiffre d'affaires
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
              </dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                Délai moyen de paiement
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.averagePaymentTime} jours
              </dd>
            </div>
            <div>
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <ChartBarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Montant dû
              </dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {stats.outstandingAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Factures récentes</h2>
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Numéro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Échéance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {client.invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/factures/${invoice.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.status === 'PAID'
                        ? 'Payée'
                        : invoice.status === 'OVERDUE'
                        ? 'En retard'
                        : 'En attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                    {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 