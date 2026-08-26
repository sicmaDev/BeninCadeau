import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser } from '../../../../utils/auth';
import { DiscountType } from '@prisma/client';

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
    const promocodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ promocodes });
  } catch (error) {
    console.error('Fetch promo codes admin error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { code, discountType, discountValue, expiresAt, active } = body;

    if (!code || !discountType || discountValue === undefined || !expiresAt) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const promocode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType: discountType as DiscountType,
        discountValue: parseInt(discountValue, 10),
        expiresAt: new Date(expiresAt),
        active: active !== undefined ? !!active : true,
      },
    });

    return NextResponse.json({ success: true, promocode });
  } catch (error) {
    console.error('Create promo code error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du code promo.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, code, discountType, discountValue, expiresAt, active } = body;

    if (!id || !code || !discountType || discountValue === undefined || !expiresAt) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const promocode = await prisma.promoCode.update({
      where: { id: parseInt(id, 10) },
      data: {
        code: code.toUpperCase(),
        discountType: discountType as DiscountType,
        discountValue: parseInt(discountValue, 10),
        expiresAt: new Date(expiresAt),
        active: active !== undefined ? !!active : true,
      },
    });

    return NextResponse.json({ success: true, promocode });
  } catch (error) {
    console.error('Update promo code error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification du code promo.' }, { status: 500 });
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

    await prisma.promoCode.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete promo code error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du code promo (des commandes y font peut-être référence).' }, { status: 500 });
  }
}
