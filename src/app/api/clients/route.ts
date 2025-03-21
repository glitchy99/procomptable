import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  taxId: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientWithCount extends Client {
  _count: {
    invoices: number;
  };
}

interface InvoiceStats {
  total: number | null;
  createdAt: Date | null;
  paidAt: Date | null;
}

const clientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
  companyId: z.string().min(1, 'L\'entreprise est requise'),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    });

    if (!user?.company) {
      return NextResponse.json([]);
    }

    const clients = await prisma.client.findMany({
      where: {
        companyId: user.company.id,
      },
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error in GET /api/clients:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    });

    if (!user?.company) {
      return NextResponse.json(
        { error: 'Vous devez créer une entreprise' },
        { status: 400 }
      );
    }

    const data = await request.json();
    const { name, email, phone, address, taxId } = clientSchema.parse(data);

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        address,
        taxId,
        company: {
          connect: { id: user.company.id },
        },
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error in POST /api/clients:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 