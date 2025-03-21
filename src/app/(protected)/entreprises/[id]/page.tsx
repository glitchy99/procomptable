import { notFound } from 'next/navigation';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CompanyDetail from '@/components/companies/CompanyDetail';

// Cache the getCompany function to prevent unnecessary database queries
const getCompany = cache(async (id: string) => {
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

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            clients: true,
            invoices: true,
          },
        },
      },
    });

    if (!company) {
      return null;
    }

    return company;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
});

interface PageProps {
  params: { id: string };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  // Properly handle async params
  const company = await getCompany(params.id);

  if (!company) {
    notFound();
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
            <p className="mt-2 text-sm text-gray-700">
              Détails et informations de l&apos;entreprise.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              href={`/entreprises/${company.id}/modifier`}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Modifier
            </a>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <CompanyDetail company={company} />
          </div>
        </div>
      </div>
    </div>
  );
} 