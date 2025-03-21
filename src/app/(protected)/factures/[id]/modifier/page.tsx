import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import InvoiceForm from '@/components/invoices/InvoiceForm';

const prisma = new PrismaClient();

export default async function EditInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const [invoice, clients] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        items: true,
      },
    }),
    prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  if (!invoice) {
    notFound();
  }

  const initialData = {
    ...invoice,
    dueDate: invoice.dueDate.toISOString().split('T')[0],
    items: invoice.items.map((item) => ({
      ...item,
      id: item.id.toString(),
    })),
  };

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">
          Modifier la facture #{invoice.number}
        </h1>
      </div>
      <div className="mt-6">
        <InvoiceForm clients={clients} initialData={initialData} />
      </div>
    </div>
  );
} 