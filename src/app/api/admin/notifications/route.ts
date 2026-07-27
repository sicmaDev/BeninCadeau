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
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Fetch notifications admin error:', error);
    return NextResponse.json({ error: 'Erreur lors du chargement des notifications.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === 'read_all') {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'read_one') {
      if (!id) {
        return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
      }
      await prisma.notification.update({
        where: { id: parseInt(id, 10) },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Action invalide.' }, { status: 400 });
  } catch (error) {
    console.error('Update notifications admin error:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour des notifications.' }, { status: 500 });
  }
}
