import { NextResponse } from 'next/server';
import { prisma } from '../../../../utils/db';
import { getCurrentUser } from '../../../../utils/auth';

export const dynamic = 'force-dynamic';

// Helper to check admin auth
async function checkAdminAuth() {
  const user = await getCurrentUser();
  return user && user.role === 'ADMIN';
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Fetch products admin error:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      stock,
      estimatedDelivery,
      images,
      isCustomizable,
      customFieldPlaceholder,
      active,
      categoryId,
    } = body;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || '',
        price: parseInt(price, 10),
        stock: parseInt(stock, 10) || 0,
        estimatedDelivery: estimatedDelivery || '48h',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        isCustomizable: !!isCustomizable,
        customFieldPlaceholder: customFieldPlaceholder || null,
        active: active !== undefined ? !!active : true,
        categoryId: parseInt(categoryId, 10),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du produit.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      description,
      price,
      stock,
      estimatedDelivery,
      images,
      isCustomizable,
      customFieldPlaceholder,
      active,
      categoryId,
    } = body;

    if (!id || !name || !slug || !price || !categoryId) {
      return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        slug,
        description: description || '',
        price: parseInt(price, 10),
        stock: parseInt(stock, 10) || 0,
        estimatedDelivery: estimatedDelivery || '48h',
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        isCustomizable: !!isCustomizable,
        customFieldPlaceholder: customFieldPlaceholder || null,
        active: active !== undefined ? !!active : true,
        categoryId: parseInt(categoryId, 10),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification du produit.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
    }

    // On peut désactiver le produit au lieu de le supprimer complètement pour préserver l'historique des commandes
    await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du produit.' }, { status: 500 });
  }
}
