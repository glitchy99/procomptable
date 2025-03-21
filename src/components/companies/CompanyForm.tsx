'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { BuildingOfficeIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';

interface CompanyFormProps {
  initialData?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
  };
}

export default function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    taxId: initialData?.taxId || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/companies', {
        method: initialData?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialData?.id ? { ...formData, id: initialData.id } : formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Une erreur est survenue');
      }

      toast.success(initialData?.id ? 'Entreprise modifiée avec succès' : 'Entreprise créée avec succès');
      router.push('/entreprises');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Company Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l&apos;entreprise
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Nom de l'entreprise"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="email@entreprise.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Téléphone
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phone"
              id="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="+216 XX XXX XXX"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="address"
              id="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Adresse complète"
            />
          </div>
        </div>

        {/* Tax ID */}
        <div>
          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700 mb-2">
            Matricule fiscal
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IdentificationIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="taxId"
              id="taxId"
              required
              value={formData.taxId}
              onChange={handleChange}
              className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Matricule fiscal"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className={`
            inline-flex items-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200
            ${loading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-md'}
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          `}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enregistrement...
            </>
          ) : (
            'Enregistrer'
          )}
        </button>
      </div>
    </form>
  );
} 