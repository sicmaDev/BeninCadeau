import { PrismaClient, UserRole, DiscountType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du seeding...');

  // Nettoyage de la base de données
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.promoCode.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.shippingZone.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Base de données nettoyée.');

  // 1. Création des utilisateurs (Admin & Client)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('client123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Administrateur Bénin Cadeau',
      email: 'admin@benincadeau.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Jean DUPONT',
      email: 'jean.dupont@gmail.com',
      passwordHash: customerPasswordHash,
      role: UserRole.CUSTOMER,
      phone: '+229 90 00 00 01',
      address: 'Haie Vive, Cotonou',
    },
  });

  console.log('Utilisateurs créés :', { admin: admin.email, customer: customer.email });

  // 2. Création des catégories
  const catPerso = await prisma.category.create({
    data: { name: 'Cadeaux personnalisés', slug: 'cadeaux-personnalises', displayOrder: 1 },
  });

  const catOccasions = await prisma.category.create({
    data: { name: 'Occasions spéciales', slug: 'occasions-speciales', displayOrder: 2 },
  });

  const catPaniers = await prisma.category.create({
    data: { name: 'Paniers de ravitaillement', slug: 'paniers-ravitaillement', displayOrder: 3 },
  });

  console.log('Catégories créées.');

  // 3. Création des zones de livraison
  const zoneCotonou = await prisma.shippingZone.create({
    data: { name: 'Cotonou (Ville)', deliveryFee: 1500 },
  });

  const zoneCalavi = await prisma.shippingZone.create({
    data: { name: 'Abomey-Calavi', deliveryFee: 2500 },
  });

  const zonePorto = await prisma.shippingZone.create({
    data: { name: 'Porto-Novo', deliveryFee: 3500 },
  });

  console.log('Zones de livraison créées.');

  // 4. Création des codes promos
  const promoCadeau = await prisma.promoCode.create({
    data: {
      code: 'CAD229',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10, // 10% de réduction
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valide 30 jours
    },
  });

  const promoFete = await prisma.promoCode.create({
    data: {
      code: 'FETECOTONOU',
      discountType: DiscountType.FIXED,
      discountValue: 2000, // 2000 FCFA de réduction
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Valide 15 jours
    },
  });

  console.log('Codes promos créés.');

  // 5. Création des produits
  // Cadeaux personnalisés
  await prisma.product.create({
    data: {
      name: 'Mug Personnalisé Bénin',
      slug: 'mug-personnalise-benin',
      description: 'Un magnifique mug en céramique personnalisé avec le texte et la photo de votre choix. Idéal pour commencer la journée avec le sourire.',
      price: 4500,
      stock: 50,
      estimatedDelivery: '24h à 48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Entrez le prénom ou texte à inscrire sur le mug',
      categoryId: catPerso.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Cadre Photo Lumineux',
      slug: 'cadre-photo-lumineux',
      description: 'Cadre en acrylique rétro-éclairé par LED pour illuminer vos plus beaux souvenirs. Gravure personnalisée comprise.',
      price: 15000,
      stock: 20,
      estimatedDelivery: '48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Message ou date spéciale à graver',
      categoryId: catPerso.id,
    },
  });

  // Occasions spéciales
  await prisma.product.create({
    data: {
      name: 'Pack Anniversaire Royal',
      slug: 'pack-anniversaire-royal',
      description: 'Un coffret complet comprenant une bouteille de champagne, des chocolats fins, un bouquet de fleurs fraîches et une carte de vœux.',
      price: 45000,
      stock: 15,
      estimatedDelivery: '24h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: false,
      categoryId: catOccasions.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Boîte de Roses Éternelles',
      slug: 'boite-roses-eternelles',
      description: 'Une superbe boîte ronde contenant 9 roses éternelles rouges qui conservent leur éclat pendant plusieurs années sans aucun entretien.',
      price: 25000,
      stock: 10,
      estimatedDelivery: '24h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Texte court sur le ruban',
      categoryId: catOccasions.id,
    },
  });

  // Paniers de ravitaillement
  await prisma.product.create({
    data: {
      name: 'Panier Ravitaillement Essentiel',
      slug: 'panier-ravitaillement-essentiel',
      description: 'Ravitaillement idéal pour vos proches au Bénin : riz de luxe, huile, lait, sucre, pâtes alimentaires, sardines et autres produits de première nécessité.',
      price: 35000,
      stock: 100,
      estimatedDelivery: '24h à 48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: false,
      categoryId: catPaniers.id,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Panier Ravitaillement Premium',
      slug: 'panier-ravitaillement-premium',
      description: 'Le panier de ravitaillement le plus complet. Comprend tout le panier essentiel avec en plus : chocolat, café, jus de fruits pressés, purée de tomate et détergents.',
      price: 60000,
      stock: 40,
      estimatedDelivery: '24h à 48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: false,
      categoryId: catPaniers.id,
    },
  });

  console.log('Produits créés.');
  console.log('Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
