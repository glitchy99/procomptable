import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const invoiceSchema = z.object({
  number: z.string(),
  date: z.string(),
  dueDate: z.string(),
  clientId: z.string(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    taxRate: z.number(),
    accountCode: z.string().optional(),
  })),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user?.company) {
      return new NextResponse('Company not found', { status: 404 });
    }

    const body = await request.json();
    const validatedData = invoiceSchema.parse(body);

    // Calculate totals
    const items = validatedData.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 + item.taxRate / 100),
    }));

    // Calculate invoice totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
    const total = subtotal + tax;

    const invoice = await prisma.invoice.create({
      data: {
        number: validatedData.number,
        date: new Date(validatedData.date),
        dueDate: new Date(validatedData.dueDate),
        status: 'DRAFT',
        subtotal,
        tax,
        total,
        company: { connect: { id: user.company.id } },
        client: { connect: { id: validatedData.clientId } },
        createdBy: { connect: { id: user.id } },
        items: {
          create: items
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid invoice data', { status: 400 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { company: true }
    });

    if (!user?.company) {
      return new NextResponse('Company not found', { status: 404 });
    }

    const invoices = await prisma.invoice.findMany({
      where: {
        companyId: user.company.id
      },
      include: {
        client: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 