import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { hashPassword, setSessionCookie } from '../../../../utils/auth';

export async function POST(request: Request) {
  try {
    const { name, email, password, phone, address } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nom, email et mot de passe sont requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet e-mail est déjà utilisé' },
        { status: 400 }
      );
    }

    // Hacher le mot de passe et créer l'utilisateur
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
        address: address || null,
        role: 'CUSTOMER',
      },
    });

    // Créer une notification dynamique pour l'admin
    await prisma.notification.create({
      data: {
        title: "Nouveau client",
        message: `${name} (${email}) s'est inscrit sur la plateforme.`
      }
    }).catch(err => console.error('Failed to create admin notification:', err));

    // Émettre la session
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue' },
      { status: 500 }
    );
  }
}
