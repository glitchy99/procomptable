import Navigation from '@/components/layout/Navigation';
import Header from '@/components/layout/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Providers from '@/components/providers/Providers';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <Providers session={session}>
      <div className="min-h-screen bg-gray-50/50">
        <Navigation />
        <div className="lg:pl-72">
          <Header />
          <main className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </Providers>
  );
} 