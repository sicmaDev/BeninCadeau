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
    const zones = await prisma.shippingZone.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ zones });
  } catch (error) {
    console.error('Fetch shipping zones admin error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, deliveryFee } = body;

    if (!name || deliveryFee === undefined) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const zone = await prisma.shippingZone.create({
      data: {
        name,
        deliveryFee: parseInt(deliveryFee, 10),
      },
    });

    return NextResponse.json({ success: true, zone });
  } catch (error) {
    console.error('Create shipping zone error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la zone.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, name, deliveryFee } = body;

    if (!id || !name || deliveryFee === undefined) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const zone = await prisma.shippingZone.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        deliveryFee: parseInt(deliveryFee, 10),
      },
    });

    return NextResponse.json({ success: true, zone });
  } catch (error) {
    console.error('Update shipping zone error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification de la zone.' }, { status: 500 });
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

    await prisma.shippingZone.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete shipping zone error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression de la zone (des commandes y font peut-être référence).' }, { status: 500 });
  }
}
