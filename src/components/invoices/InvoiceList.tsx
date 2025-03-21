'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Invoice, Client, Company } from '@prisma/client';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type InvoiceWithRelations = Invoice & {
  client: Client;
  company: Company;
};

interface InvoiceListProps {
  invoices: InvoiceWithRelations[];
}

export default function InvoiceList({ invoices: initialInvoices }: InvoiceListProps) {
  const router = useRouter();
  const [invoices, setInvoices] = useState(initialInvoices);
  const [sortField, setSortField] = useState<keyof Invoice>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  };

  const handleSort = (field: keyof Invoice) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);

    const sortedInvoices = [...invoices].sort((a, b) => {
      if (field === 'date' || field === 'dueDate') {
        return newDirection === 'asc'
          ? new Date(a[field]).getTime() - new Date(b[field]).getTime()
          : new Date(b[field]).getTime() - new Date(a[field]).getTime();
      }
      if (field === 'total' || field === 'subtotal' || field === 'tax') {
        return newDirection === 'asc'
          ? a[field] - b[field]
          : b[field] - a[field];
      }
      return 0;
    });

    setInvoices(sortedInvoices);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Payée';
      case 'OVERDUE':
        return 'En retard';
      case 'SENT':
        return 'Envoyée';
      case 'DRAFT':
        return 'Brouillon';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
  };

  const confirmDelete = async () => {
    if (!invoiceToDelete) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/invoices/${invoiceToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la facture');
      }

      setInvoices(invoices.filter((i) => i.id !== invoiceToDelete.id));
      setInvoiceToDelete(null);
      router.refresh();
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <button
                        onClick={() => handleSort('number')}
                        className="group inline-flex"
                      >
                        Numéro
                        <span className="ml-2 flex-none rounded text-gray-400">
                          {sortField === 'number' ? (
                            sortDirection === 'desc' ? (
                              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                            )
                          ) : null}
                        </span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <button
                        onClick={() => handleSort('date')}
                        className="group inline-flex"
                      >
                        Date
                        <span className="ml-2 flex-none rounded text-gray-400">
                          {sortField === 'date' ? (
                            sortDirection === 'desc' ? (
                              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                            )
                          ) : null}
                        </span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <button
                        onClick={() => handleSort('total')}
                        className="group inline-flex"
                      >
                        Montant
                        <span className="ml-2 flex-none rounded text-gray-400">
                          {sortField === 'total' ? (
                            sortDirection === 'desc' ? (
                              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                            ) : (
                              <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                            )
                          ) : null}
                        </span>
                      </button>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Statut
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {invoice.number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {invoice.client.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusText(invoice.status)}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/factures/${invoice.id}`}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                          <a
                            href={`/factures/${invoice.id}/modifier`}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => handleDelete(invoice)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {invoiceToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setInvoiceToDelete(null)}
            ></div>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Supprimer la facture
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Êtes-vous sûr de vouloir supprimer la facture #{invoiceToDelete.number} ?
                      Cette action ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>

              {deleteError && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {deleteError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setInvoiceToDelete(null)}
                  disabled={isDeleting}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 