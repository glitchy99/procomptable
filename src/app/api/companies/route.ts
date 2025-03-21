import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const companySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide').optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  taxId: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const companies = await prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            clients: true,
            invoices: true,
          },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des entreprises' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await req.json();

    // Get the user's company
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { company: true }
    });

    // Create the company
    const company = await prisma.company.create({
      data: {
        name: data.name,
        ice: data.ice,
        address: data.address,
        city: data.city,
        phone: data.phone,
        email: data.email,
        website: data.website,
        rc: data.rc,
        cnss: data.cnss,
        if: data.if,
        tp: data.tp,
        users: {
          connect: { id: user!.id }
        }
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de l\'entreprise' },
      { status: 500 }
    );
  }
} 