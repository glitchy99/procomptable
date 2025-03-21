'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxRate: number;
  accountCode: string;
  invoiceId: string;
}

interface Invoice {
  id: string;
  number: string;
  date: Date;
  dueDate: Date;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
  items: InvoiceItem[];
  client: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    taxId: string | null;
  };
  company: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    taxId: string | null;
  };
  createdBy: {
    name: string | null;
    email: string | null;
  };
}

export default function InvoiceDetail({ invoice }: { invoice: Invoice }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Payée';
      case 'OVERDUE':
        return 'En retard';
      case 'DRAFT':
        return 'Brouillon';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg mt-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Client</h3>
            <dl className="grid grid-cols-1 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="text-sm text-gray-900">{invoice.client.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Adresse</dt>
                <dd className="text-sm text-gray-900">{invoice.client.address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-sm text-gray-900">{invoice.client.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Téléphone</dt>
                <dd className="text-sm text-gray-900">{invoice.client.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">N° Fiscal</dt>
                <dd className="text-sm text-gray-900">{invoice.client.taxId}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Détails</h3>
            <dl className="grid grid-cols-1 gap-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Numéro</dt>
                <dd className="text-sm text-gray-900">{invoice.number}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="text-sm text-gray-900">
                  {format(new Date(invoice.date), 'PPP', { locale: fr })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Échéance</dt>
                <dd className="text-sm text-gray-900">
                  {format(new Date(invoice.dueDate), 'PPP', { locale: fr })}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Statut</dt>
                <dd className="text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusText(invoice.status)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Créée par</dt>
                <dd className="text-sm text-gray-900">
                  {invoice.createdBy.name || invoice.createdBy.email}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Articles</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix unitaire
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                TVA
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total HT
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total TTC
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map((item) => {
              const totalHT = item.quantity * item.unitPrice;
              const totalTTC = totalHT * (1 + item.taxRate / 100);

              return (
                <tr key={item.id}>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {item.accountCode}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {item.unitPrice.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {item.taxRate}%
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {totalHT.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900 text-right">
                    {totalTTC.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                Total HT
              </td>
              <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                {invoice.subtotal.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={5} className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                TVA
              </td>
              <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                {invoice.tax.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={5} className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                Total TTC
              </td>
              <td className="px-3 py-4 text-sm font-medium text-gray-900 text-right">
                {invoice.total.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {invoice.notes && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
} 