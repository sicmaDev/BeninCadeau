import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code promo requis' }, { status: 400 });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promo) {
      return NextResponse.json({ error: 'Ce code promo n\'existe pas' }, { status: 404 });
    }

    if (!promo.active) {
      return NextResponse.json({ error: 'Ce code promo n\'est plus actif' }, { status: 400 });
    }

    const now = new Date();
    if (new Date(promo.expiresAt) < now) {
      return NextResponse.json({ error: 'Ce code promo a expiré' }, { status: 400 });
    }

    return NextResponse.json({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (error) {
    console.error('Promo code validation error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la validation du code promo' },
      { status: 500 }
    );
  }
}
