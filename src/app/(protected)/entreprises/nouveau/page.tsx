'use client';

import CompanyForm from '@/components/companies/CompanyForm';

export default function NewCompanyPage() {
  return (
    <div className="py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nouvelle entreprise</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ajoutez une nouvelle entreprise en remplissant le formulaire ci-dessous.
          </p>
        </div>
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <CompanyForm />
          </div>
        </div>
      </div>
    </div>
  );
} 