import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get user's company
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { company: true },
    });

    if (!user?.company) {
      return NextResponse.json(
        { message: 'Utilisateur non associé à une entreprise' },
        { status: 400 }
      );
    }

    // Verify client exists and belongs to user's company
    const client = await prisma.client.findUnique({
      where: { id: params.id },
    });

    if (!client) {
      return NextResponse.json(
        { message: 'Client non trouvé' },
        { status: 404 }
      );
    }

    if (client.companyId !== user.company.id) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Get client's invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        clientId: params.id,
        companyId: user.company.id,
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        number: true,
        date: true,
        dueDate: true,
        status: true,
        total: true,
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching client invoices:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la récupération des factures' },
      { status: 500 }
    );
  }
} 