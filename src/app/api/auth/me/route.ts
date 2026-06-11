import { NextResponse } from 'next/server';
import { getCurrentUser } from '../../../../utils/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue' },
      { status: 500 }
    );
  }
}
