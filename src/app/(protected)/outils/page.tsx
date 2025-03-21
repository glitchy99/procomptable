'use client';

import { useState } from 'react';
import { CalculatorIcon, DocumentDuplicateIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function OutilsPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'pcm',
      name: 'Plan Comptable Marocain',
      description: 'Consultez le plan comptable marocain normalisé',
      icon: DocumentDuplicateIcon,
    },
    {
      id: 'calculator',
      name: 'Calculatrice TVA',
      description: 'Calculez la TVA et autres taxes',
      icon: CalculatorIcon,
    },
    {
      id: 'ratios',
      name: 'Ratios Financiers',
      description: 'Calculez et analysez les ratios financiers',
      icon: ChartBarIcon,
    },
  ];

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Outils Comptables</h1>
        <p className="mt-2 text-sm text-gray-700">
          Accédez à des outils comptables essentiels pour votre activité
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedTool(tool.id)}
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <tool.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTool === 'pcm' && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Plan Comptable Marocain</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Classe 1 - Comptes de financement permanent</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>11 - Capitaux propres</li>
                <li>14 - Dettes de financement</li>
                <li>15 - Provisions durables pour risques et charges</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Classe 2 - Comptes d'actif immobilisé</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>21 - Immobilisations en non-valeurs</li>
                <li>22 - Immobilisations incorporelles</li>
                <li>23 - Immobilisations corporelles</li>
              </ul>
            </div>
            {/* Add more classes as needed */}
          </div>
        </div>
      )}

      {selectedTool === 'calculator' && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Calculatrice TVA</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant HT</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taux TVA</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="0.20">20%</option>
                <option value="0.14">14%</option>
                <option value="0.10">10%</option>
                <option value="0.07">7%</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {selectedTool === 'ratios' && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ratios Financiers</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ratios de liquidité</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>Ratio de liquidité générale = Actif circulant / Passif circulant</li>
                <li>Ratio de liquidité réduite = (Actif circulant - Stocks) / Passif circulant</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ratios de solvabilité</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                <li>Ratio d'autonomie financière = Capitaux propres / Total passif</li>
                <li>Ratio d'endettement = Dettes totales / Capitaux propres</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 