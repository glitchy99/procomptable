import { notFound } from 'next/navigation';
import { cache } from 'react';
import InvoiceDetail from '@/components/invoices/InvoiceDetail';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Cache the getInvoice function to prevent unnecessary database queries
const getInvoice = cache(async (id: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { company: true }
    });

    if (!user?.company) {
      return null;
    }

    const invoice = await prisma.invoice.findUnique({
      where: { 
        id,
        companyId: user.company.id // Ensure the invoice belongs to the user's company
      },
      include: {
        client: true,
        company: true,
        items: {
          select: {
            id: true,
            description: true,
            quantity: true,
            unitPrice: true,
            total: true,
            accountCode: true,
            taxRate: true,
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!invoice) {
      return null;
    }

    return invoice;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
});

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  if (!invoice) {
    notFound();
  }

  return (
    <div>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Facture #{invoice.number}
        </h1>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <a
            href={`/factures/${invoice.id}/modifier`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Modifier
          </a>
          <button
            type="button"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Imprimer
          </button>
        </div>
      </div>
      <InvoiceDetail invoice={invoice} />
    </div>
  );
}

// Add static page generation for better performance
export async function generateStaticParams() {
  const invoices = await prisma.invoice.findMany({
    select: { id: true },
    take: 20, // Limit to recent invoices
    orderBy: { createdAt: 'desc' },
  });

  return invoices.map((invoice: { id: string }) => ({
    id: invoice.id,
  }));
} 