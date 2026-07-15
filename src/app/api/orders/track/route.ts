import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json(
        { error: 'Veuillez fournir un numéro de commande.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber: code },
      select: {
        orderNumber: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        clientName: true,
        shippingAddress: true,
        shippingZone: {
          select: { name: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Aucune commande trouvée avec ce numéro. Vérifiez le code et réessayez.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
