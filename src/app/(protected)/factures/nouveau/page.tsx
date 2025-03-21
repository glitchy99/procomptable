import { PrismaClient } from '@prisma/client';
import InvoiceForm from '@/components/invoices/InvoiceForm';

const prisma = new PrismaClient();

export default async function NewInvoicePage() {
  const clients = await prisma.client.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Nouvelle Facture</h1>
      </div>
      <div className="mt-6">
        <InvoiceForm clients={clients} />
      </div>
    </div>
  );
} 