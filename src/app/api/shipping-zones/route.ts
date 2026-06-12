import { NextResponse } from 'next/server';
import { prisma } from '../../../utils/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ zones });
  } catch (error) {
    console.error('Fetch shipping zones error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la récupération des zones.' },
      { status: 500 }
    );
  }
}
