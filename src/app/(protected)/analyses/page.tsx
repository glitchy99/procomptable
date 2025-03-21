'use client';

import { useState } from 'react';
import { ChartBarIcon, ChartPieIcon, ArrowTrendingUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function AnalysesPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  const analyses = [
    {
      id: 'performance',
      name: 'Performance Financière',
      description: 'Analysez la performance financière de votre entreprise',
      icon: ChartBarIcon,
      metrics: [
        { name: 'Chiffre d\'affaires', value: '2,500,000 MAD', change: '+12.3%' },
        { name: 'Résultat net', value: '450,000 MAD', change: '+8.1%' },
        { name: 'Marge brute', value: '35%', change: '+2.5%' },
      ]
    },
    {
      id: 'balance',
      name: 'Analyse du Bilan',
      description: 'Examinez la structure de votre bilan',
      icon: ChartPieIcon,
      metrics: [
        { name: 'Total actif', value: '5,800,000 MAD', change: '+15.2%' },
        { name: 'Capitaux propres', value: '3,200,000 MAD', change: '+9.8%' },
        { name: 'Dettes financières', value: '1,500,000 MAD', change: '-5.3%' },
      ]
    },
    {
      id: 'trends',
      name: 'Tendances',
      description: 'Visualisez les tendances financières',
      icon: ArrowTrendingUpIcon,
      metrics: [
        { name: 'Croissance CA', value: '+12.3%', change: '+2.1%' },
        { name: 'Évolution des charges', value: '+8.7%', change: '-1.2%' },
        { name: 'Progression trésorerie', value: '+15.5%', change: '+4.3%' },
      ]
    },
    {
      id: 'cash',
      name: 'Trésorerie',
      description: 'Analysez votre situation de trésorerie',
      icon: CurrencyDollarIcon,
      metrics: [
        { name: 'Solde de trésorerie', value: '850,000 MAD', change: '+20.5%' },
        { name: 'Flux opérationnels', value: '620,000 MAD', change: '+15.2%' },
        { name: 'BFR', value: '380,000 MAD', change: '-8.3%' },
      ]
    },
  ];

  return (
    <div>
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-900">Analyses Financières</h1>
        <p className="mt-2 text-sm text-gray-700">
          Visualisez et analysez vos données financières
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {analyses.map((analysis) => (
          <div
            key={analysis.id}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedAnalysis(analysis.id)}
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <analysis.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">
                <span className="absolute inset-0" aria-hidden="true" />
                {analysis.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500">{analysis.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedAnalysis && (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {analyses.find(a => a.id === selectedAnalysis)?.name}
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {analyses
              .find(a => a.id === selectedAnalysis)
              ?.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                >
                  <dt>
                    <div className="absolute bg-indigo-500 rounded-md p-3">
                      <ChartBarIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-sm font-medium text-gray-500 truncate">{metric.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                      metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change}
                    </p>
                  </dd>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 