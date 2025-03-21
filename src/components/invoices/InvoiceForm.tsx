'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Client } from '@prisma/client';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface InvoiceFormProps {
  clients: Client[];
  initialData?: any;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  accountCode: string;
  total: number;
}

export default function InvoiceForm({ clients, initialData }: InvoiceFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialData?.items || [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        accountCode: '',
        total: 0,
      },
    ]
  );

  const [selectedClient, setSelectedClient] = useState<string>(
    initialData?.clientId || ''
  );
  const [dueDate, setDueDate] = useState<string>(
    initialData?.dueDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [number, setNumber] = useState<string>(
    initialData?.number || generateInvoiceNumber()
  );
  const [date, setDate] = useState<string>(
    initialData?.date || new Date().toISOString().split('T')[0]
  );

  const isEditing = !!initialData;

  function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `FAC-${year}${month}-${random}`;
  }

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Math.random().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        accountCode: '',
        total: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.2; // 20% TVA
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!selectedClient) {
      setError('Veuillez sélectionner un client');
      setIsLoading(false);
      return;
    }

    if (lineItems.length === 0) {
      setError('Veuillez ajouter au moins une ligne');
      setIsLoading(false);
      return;
    }

    const invalidItems = lineItems.filter(
      (item) => !item.description || !item.accountCode || item.total === 0
    );

    if (invalidItems.length > 0) {
      setError('Veuillez remplir tous les champs pour chaque ligne');
      setIsLoading(false);
      return;
    }

    try {
      const url = isEditing
        ? `/api/invoices/${initialData.id}`
        : '/api/invoices';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedClient,
          number,
          date,
          dueDate,
          items: lineItems.map(item => ({
            ...item,
            taxRate: 20 // 20% TVA
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? 'Erreur lors de la modification de la facture'
            : 'Erreur lors de la création de la facture'
        );
      }

      router.push('/factures');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="number" className="form-label">
            Numéro de facture
          </label>
          <input
            type="text"
            name="number"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="form-input"
            readOnly
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="date" className="form-label">
            Date de facturation
          </label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="client" className="form-label">
            Client
          </label>
          <select
            id="client"
            name="client"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="form-select"
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="dueDate" className="form-label">
            Date d'échéance
          </label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="section-title">Lignes de facture</h2>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={addLineItem}
              className="primary-button"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Ajouter une ligne
            </button>
          </div>
        </div>

        <div className="mt-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="table-header">Description</th>
                  <th scope="col" className="table-header">Code Comptable</th>
                  <th scope="col" className="table-header">Quantité</th>
                  <th scope="col" className="table-header">Prix unitaire</th>
                  <th scope="col" className="table-header">Total</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, 'description', e.target.value)
                        }
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Description"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        value={item.accountCode}
                        onChange={(e) =>
                          updateLineItem(item.id, 'accountCode', e.target.value)
                        }
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Code"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            'quantity',
                            parseFloat(e.target.value)
                          )
                        }
                        className="block w-20 border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        min="1"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            'unitPrice',
                            parseFloat(e.target.value)
                          )
                        }
                        className="block w-24 border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="table-cell font-medium">
                      {item.total.toFixed(2)} MAD
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <th
                    scope="row"
                    colSpan={4}
                    className="px-4 py-3 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Sous-total
                  </th>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {calculateSubtotal().toFixed(2)} MAD
                  </td>
                  <td></td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <th
                    scope="row"
                    colSpan={4}
                    className="px-4 py-3 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    TVA (20%)
                  </th>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {calculateTax().toFixed(2)} MAD
                  </td>
                  <td></td>
                </tr>
                <tr className="border-t border-gray-200 bg-gray-50">
                  <th
                    scope="row"
                    colSpan={4}
                    className="px-4 py-3 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Total
                  </th>
                  <td className="px-3 py-3 text-right text-sm font-medium text-gray-900">
                    {calculateTotal().toFixed(2)} MAD
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="secondary-button"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="primary-button"
        >
          {isLoading
            ? isEditing
              ? 'Modification...'
              : 'Création...'
            : isEditing
            ? 'Modifier la facture'
            : 'Créer la facture'}
        </button>
      </div>
    </form>
  );
} 