'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserCircleIcon, EnvelopeIcon, KeyIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      // Update the session with new user data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
        },
      });

      setSuccess(true);
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Force a router refresh to update the UI
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-lg rounded-lg">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="h-32 rounded-t-lg bg-gradient-to-r from-indigo-600 to-purple-600" />
            
            {/* Profile icon */}
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl">
                <div className="flex h-full w-full items-center justify-center bg-indigo-600 text-3xl font-medium text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || session?.user?.email?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Profile content */}
          <div className="px-8 pt-16 pb-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Votre Profil</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`
                  inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200
                  ${isEditing
                    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'}
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                `}
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-8">
                {/* Name field */}
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`
                        block w-full rounded-lg pl-10 pr-3 py-3 text-sm transition-colors duration-200
                        ${isEditing
                          ? 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'
                          : 'border-transparent bg-gray-50 text-gray-500'}
                        disabled:cursor-not-allowed disabled:opacity-75
                      `}
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`
                        block w-full rounded-lg pl-10 pr-3 py-3 text-sm transition-colors duration-200
                        ${isEditing
                          ? 'border-gray-300 bg-white focus:border-indigo-500 focus:ring-indigo-500'
                          : 'border-transparent bg-gray-50 text-gray-500'}
                        disabled:cursor-not-allowed disabled:opacity-75
                      `}
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Password fields - only shown when editing */}
                {isEditing && (
                  <div className="space-y-8 rounded-lg bg-gray-50 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Changer le mot de passe</h3>
                    
                    <div className="relative">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Mot de passe actuel
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Entrez votre mot de passe actuel"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Entrez votre nouveau mot de passe"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Laissez vide si vous ne souhaitez pas changer de mot de passe
                      </p>
                    </div>

                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="block w-full rounded-lg border-gray-300 pl-10 pr-3 py-3 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error and success messages */}
              {error && (
                <div className="rounded-lg bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="rounded-lg bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        Votre profil a été mis à jour avec succès
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button - only shown when editing */}
              {isEditing && (
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
                      'Enregistrer les modifications'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 