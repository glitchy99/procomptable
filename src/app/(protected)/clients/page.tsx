'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';
import ClientList from '@/components/clients/ClientList';
import AddClientModal from '@/components/clients/AddClientModal';

export default function ClientsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompany, setHasCompany] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    checkCompanyStatus();
  }, [session, router]);

  const checkCompanyStatus = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setHasCompany(data.length > 0);
      }
    } catch (error) {
      console.error('Error checking company status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!hasCompany) {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Créez votre entreprise pour commencer
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vous devez créer une entreprise avant de pouvoir ajouter des clients.
            </p>
            <div className="mt-6">
              <a
                href="/entreprises/nouveau"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Créer mon entreprise
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="mt-2 text-sm text-gray-700">
              Liste de tous vos clients
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nouveau client
            </button>
          </div>
        </div>

        <ClientList />

        <AddClientModal
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
        />
      </div>
    </div>
  );
} 