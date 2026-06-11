import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '../../../utils/db';
import ProductDetailClient from '../../../components/ProductDetailClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product || !product.active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bc-bg py-12 px-4 sm:px-6 lg:px-8 font-instrument">
      <div className="max-w-[1200px] mx-auto">
        {/* Fil d'Ariane / Retour */}
        <div className="mb-8">
          <Link
            href="/catalogue"
            className="inline-flex items-center text-sm font-semibold text-bc-purple hover:underline"
          >
            <ArrowLeft size={16} className="mr-2" /> Retour au catalogue
          </Link>
        </div>

        {/* Détails du produit */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card border border-gray-100">
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
