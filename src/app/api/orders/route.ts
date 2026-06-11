import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';
import { getCurrentUser } from '../../../utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                slug: true,
                images: true,
              },
            },
          },
        },
        shippingZone: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue' },
      { status: 500 }
    );
  }
}
