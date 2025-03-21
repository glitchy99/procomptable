import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function PUT(
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

    const { clientId, dueDate, items } = await req.json();

    // Validate input
    if (!clientId || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
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

    // Get existing invoice
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    if (existingInvoice.companyId !== user.company.id) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
    const tax = subtotal * 0.2; // 20% TVA
    const total = subtotal + tax;

    // Update invoice
    const invoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        dueDate: new Date(dueDate),
        subtotal,
        tax,
        total,
        client: { connect: { id: clientId } },
        items: {
          deleteMany: {},
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            accountCode: item.accountCode,
          })),
        },
      },
      include: {
        items: true,
        client: true,
        company: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Invoice update error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la modification de la facture' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get existing invoice
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { message: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    if (existingInvoice.companyId !== user.company.id) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 403 }
      );
    }

    // Delete invoice and related items
    await prisma.invoice.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Facture supprimée avec succès' });
  } catch (error) {
    console.error('Invoice deletion error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la suppression de la facture' },
      { status: 500 }
    );
  }
} 