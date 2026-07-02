import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getCurrentUser } from '../../../../utils/auth';

export async function POST(req: Request) {
  try {
    // Vérification de sécurité Admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    // Validation du type de fichier (limiter aux formats d'images autorisés)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Seuls les fichiers images sont autorisés.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (!ext || !allowedExtensions.includes(ext)) {
      return NextResponse.json({ error: 'Format de fichier non supporté.' }, { status: 400 });
    }

    // Lire les octets du fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Créer le dossier public/uploads s'il n'existe pas
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Le dossier existe déjà ou impossible de créer
    }

    // Nettoyer le nom de fichier pour éviter les injections de chemins
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = join(uploadDir, filename);

    // Écrire le fichier sur le disque
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue lors de l\'envoi de l\'image.' },
      { status: 500 }
    );
  }
}
