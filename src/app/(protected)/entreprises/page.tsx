import { cache } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

// Cache the getCompanies function to prevent unnecessary database queries
const getCompanies = cache(async (page = 1, limit = 10) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return { companies: [], total: 0 };
    }

    const skip = (page - 1) * limit;

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: {
          _count: {
            select: {
              clients: true,
              invoices: true,
            },
          },
        },
      }),
      prisma.company.count(),
    ]);

    return { companies, total };
  } catch (error) {
    console.error('Error fetching companies:', error);
    return { companies: [], total: 0 };
  }
});

interface PageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 10;
  const { companies, total } = await getCompanies(currentPage, limit);
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entreprises</h1>
            <p className="mt-2 text-sm text-gray-700">
              Liste des entreprises enregistrées dans votre compte.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href="/entreprises/nouveau"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              Nouvelle entreprise
            </Link>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="mt-6 text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune entreprise</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre première entreprise.
            </p>
            <div className="mt-6">
              <Link
                href="/entreprises/nouveau"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Ajouter une entreprise
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            Nom
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            ICE
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Clients
                          </th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                            Factures
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {companies.map((company) => (
                          <tr key={company.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {company.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{company.ice}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {company._count.clients}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {company._count.invoices}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <Link
                                href={`/entreprises/${company.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Détails<span className="sr-only">, {company.name}</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {totalPages > 1 && (
              <nav className="mt-4 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
                <div className="-mt-px flex w-0 flex-1">
                  {currentPage > 1 && (
                    <Link
                      href={`/entreprises?page=${currentPage - 1}`}
                      className="inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      Précédent
                    </Link>
                  )}
                </div>
                <div className="hidden md:-mt-px md:flex">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Link
                        key={page}
                        href={`/entreprises?page=${page}`}
                        className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                          currentPage === page
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>
                <div className="-mt-px flex w-0 flex-1 justify-end">
                  {currentPage < totalPages && (
                    <Link
                      href={`/entreprises?page=${currentPage + 1}`}
                      className="inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    >
                      Suivant
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
} 