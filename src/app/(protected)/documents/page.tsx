'use client';

import { useState } from 'react';
import { DocumentIcon, DocumentTextIcon, DocumentDuplicateIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const documentCategories = [
    {
      id: 'templates',
      name: 'Modèles de Documents',
      description: 'Accédez aux modèles de documents comptables',
      icon: DocumentDuplicateIcon,
      documents: [
        { id: 1, name: 'Modèle de facture', type: 'docx' },
        { id: 2, name: 'Modèle de devis', type: 'docx' },
        { id: 3, name: 'Modèle de bon de commande', type: 'docx' },
      ]
    },
    {
      id: 'legal',
      name: 'Documents Légaux',
      description: 'Documents légaux et réglementaires',
      icon: DocumentTextIcon,
      documents: [
        { id: 4, name: 'Déclaration TVA', type: 'pdf' },
        { id: 5, name: 'Déclaration IS', type: 'pdf' },
        { id: 6, name: 'Liasse fiscale', type: 'pdf' },
      ]
    },
    {
      id: 'reports',
      name: 'Rapports',
      description: 'Rapports financiers et analyses',
      icon: DocumentIcon,
      documents: [
        { id: 7, name: 'Bilan', type: 'pdf' },
        { id: 8, name: 'Compte de résultat', type: 'pdf' },
        { id: 9, name: 'Tableau de flux de trésorerie', type: 'pdf' },
      ]
    },
  ];

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Documents</h1>
        <p className="mt-2 text-sm text-gray-700">
          Gérez vos documents comptables et accédez aux modèles
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documentCategories.map((category) => (
          <div
            key={category.id}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCategory(category.id)}
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <category.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {category.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{category.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {documentCategories.find(c => c.id === selectedCategory)?.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documentCategories
              .find(c => c.id === selectedCategory)
              ?.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500"
                >
                  <div className="flex-shrink-0">
                    <DocumentArrowDownIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <a href="#" className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 