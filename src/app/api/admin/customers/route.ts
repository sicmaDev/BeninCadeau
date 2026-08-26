import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser } from '../../../../utils/auth';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const user = await getCurrentUser();
  return user && user.role === 'ADMIN';
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        _count: {
          select: { orders: true },
        },
      },
    });

    return NextResponse.json({ customers });
  } catch (error) {
    console.error('Fetch customers admin error:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération de la liste des clients.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, email, phone, address } = body;

    if (!id || !name || !email) {
      return NextResponse.json({ error: 'ID, nom et email sont requis.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { name, email, phone, address },
    });

    return NextResponse.json({ customer: updated });
  } catch (error) {
    console.error('Update customer error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification du client.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
    }

    const userIdNum = parseInt(id, 10);

    // Detach orders to prevent foreign key errors
    await prisma.order.updateMany({
      where: { userId: userIdNum },
      data: { userId: null },
    });

    await prisma.user.delete({
      where: { id: userIdNum },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete customer error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du client.' }, { status: 500 });
  }
}
