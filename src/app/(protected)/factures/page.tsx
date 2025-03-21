import { PrismaClient } from '@prisma/client';
import InvoiceList from '@/components/invoices/InvoiceList';

const prisma = new PrismaClient();

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    include: {
      client: true,
      company: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Factures</h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <a
            href="/factures/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Nouvelle Facture
          </a>
        </div>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  );
} 