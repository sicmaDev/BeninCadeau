import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser, comparePassword, hashPassword, setSessionCookie } from '../../../../utils/auth';

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone, address, currentPassword, newPassword } = body;

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Le nom complet est obligatoire.' },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'L\'adresse e-mail est obligatoire.' },
        { status: 400 }
      );
    }

    // Vérifier si l'adresse e-mail est déjà prise
    if (email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Cette adresse e-mail est déjà utilisée.' },
          { status: 400 }
        );
      }
    }

    const dataToUpdate: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
    };

    // Gestion du mot de passe
    if (newPassword && newPassword.trim()) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est requis pour changer de mot de passe.' },
          { status: 400 }
        );
      }

      // Récupérer le mot de passe hashé actuel de l'utilisateur
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!fullUser) {
        return NextResponse.json(
          { error: 'Utilisateur non trouvé.' },
          { status: 404 }
        );
      }

      const isCurrentValid = await comparePassword(currentPassword, fullUser.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: 'Le mot de passe actuel est incorrect.' },
          { status: 400 }
        );
      }

      dataToUpdate.passwordHash = await hashPassword(newPassword.trim());
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    // Si l'e-mail a changé, ré-émettre le cookie de session
    if (updatedUser.email !== user.email) {
      await setSessionCookie({
        userId: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile API error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de la mise à jour.' },
      { status: 500 }
    );
  }
}
