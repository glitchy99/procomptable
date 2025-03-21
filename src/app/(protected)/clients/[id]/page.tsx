import { notFound } from 'next/navigation';
import { cache } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ClientDetails from '@/components/clients/ClientDetails';

// Cache the getClient function to prevent unnecessary database queries
const getClient = cache(async (id: string) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { company: true },
  });

  if (!user?.company) return null;

  const client = await prisma.client.findUnique({
    where: {
      id: id,
      companyId: user.company.id,
    },
    include: {
      invoices: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return client;
});

interface PageProps {
  params: { id: string };
}

export default async function ClientDetailsPage({ params }: PageProps) {
  const client = await getClient(params.id);

  if (!client) {
    notFound();
  }

  return <ClientDetails client={client} />;
} 