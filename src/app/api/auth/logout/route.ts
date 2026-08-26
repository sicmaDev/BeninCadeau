import { NextResponse } from 'next/server';
import { clearSessionCookie } from '../../../../utils/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Déconnecté avec succès' });
  } catch (error) {
    console.error('Logout API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue' },
      { status: 500 }
    );
  }
}
