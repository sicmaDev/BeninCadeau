import { PrismaClient, UserRole, DiscountType, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateRandomAlphanumeric(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const generatedOrderNumbers = new Set<string>();
function getUniqueOrderNumber(): string {
  let num = `BC-${generateRandomAlphanumeric(4)}`;
  while (generatedOrderNumbers.has(num)) {
    num = `BC-${generateRandomAlphanumeric(4)}`;
  }
  generatedOrderNumbers.add(num);
  return num;
}

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

  // 1. Création des administrateurs (deux identifiants pour plus de commodité)
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('client123', 10);

  const admin1 = await prisma.user.create({
    data: {
      name: 'Administrateur Bénin Cadeau',
      email: 'admin@benincadeau.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      name: 'Administrateur Bénin Cadeau (bj)',
      email: 'admin@benincadeau.bj',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log('Administrateurs créés :', { admin1: admin1.email, admin2: admin2.email });

  // 2. Création de 10 clients réels
  const customersData = [
    { name: 'Marie Soglo', email: 'marie.soglo@gmail.com', phone: '+229 90 00 00 10', address: 'Haie Vive, Cotonou' },
    { name: 'Jean Dupont', email: 'jean.dupont@gmail.com', phone: '+229 97 00 00 11', address: 'Fidjrossè, Cotonou' },
    { name: 'Koffi Gnonlonfoun', email: 'koffi.gnon@yahoo.fr', phone: '+229 61 00 00 12', address: 'Abomey-Calavi' },
    { name: 'Sènami Agbossou', email: 'senami.agb@outlook.com', phone: '+229 95 00 00 13', address: 'Porto-Novo' },
    { name: 'Rachidi Bio', email: 'rachidi.bio@gmail.com', phone: '+229 96 00 00 14', address: 'Parakou' },
    { name: 'Chantal Adovi', email: 'chantal.adovi@live.fr', phone: '+229 67 00 00 15', address: 'Ouidah' },
    { name: 'Bertin Houndégnon', email: 'bertin.h@gmail.com', phone: '+229 90 00 00 16', address: 'Saint-Michel, Cotonou' },
    { name: 'Aminata Diallo', email: 'aminata.d@gmail.com', phone: '+229 65 00 00 17', address: 'Gbégamey, Cotonou' },
    { name: 'Florent Dossou', email: 'florent.dossou@gmail.com', phone: '+229 97 00 00 18', address: 'Abomey-Calavi' },
    { name: 'Pascaline Kpadonou', email: 'pascaline.k@gmail.com', phone: '+229 91 00 00 19', address: 'Porto-Novo' },
  ];

  const customers = [];
  for (const c of customersData) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        passwordHash: customerPasswordHash,
        role: UserRole.CUSTOMER,
        phone: c.phone,
        address: c.address,
      },
    });
    customers.push(user);
  }

  console.log(`${customers.length} clients réels créés.`);

  // 3. Création des catégories
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

  // 4. Création des zones de livraison
  const zoneCotonou = await prisma.shippingZone.create({
    data: { name: 'Cotonou (Ville)', deliveryFee: 1500 },
  });

  const zoneCalavi = await prisma.shippingZone.create({
    data: { name: 'Abomey-Calavi', deliveryFee: 2500 },
  });

  const zonePorto = await prisma.shippingZone.create({
    data: { name: 'Porto-Novo', deliveryFee: 3500 },
  });

  const zones = [zoneCotonou, zoneCalavi, zonePorto];
  console.log('Zones de livraison créées.');

  // 5. Création des codes promos
  const promoCadeau = await prisma.promoCode.create({
    data: {
      code: 'CAD229',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      expiresAt: new Date('2027-12-31'),
    },
  });

  const promoFete = await prisma.promoCode.create({
    data: {
      code: 'FETECOTONOU',
      discountType: DiscountType.FIXED,
      discountValue: 2000,
      expiresAt: new Date('2027-12-31'),
    },
  });

  console.log('Codes promos créés.');

  // 6. Création des produits (avec stocks variés)
  const products = [];

  // Mug - Personnalisé
  products.push(await prisma.product.create({
    data: {
      name: 'Mug Personnalisé Bénin',
      slug: 'mug-personnalise-benin',
      description: 'Un magnifique mug en céramique personnalisé avec le texte et la photo de votre choix. Idéal pour commencer la journée avec le sourire.',
      price: 4500,
      stock: 50,
      estimatedDelivery: '24h à 48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Entrez le prénom ou texte à inscrire sur le mug',
      categoryId: catPerso.id,
    },
  }));

  // Cadre Photo - Stock bas (2)
  products.push(await prisma.product.create({
    data: {
      name: 'Cadre Photo Lumineux',
      slug: 'cadre-photo-lumineux',
      description: 'Cadre en acrylique rétro-éclairé par LED pour illuminer vos plus beaux souvenirs. Gravure personnalisée comprise.',
      price: 15000,
      stock: 2,
      estimatedDelivery: '48h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Message ou date spéciale à graver',
      categoryId: catPerso.id,
    },
  }));

  // Pack Anniversaire
  products.push(await prisma.product.create({
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
  }));

  // Roses éternelles - Stock bas (3)
  products.push(await prisma.product.create({
    data: {
      name: 'Boîte de Roses Éternelles',
      slug: 'boite-roses-eternelles',
      description: 'Une superbe boîte ronde contenant 9 roses éternelles rouges qui conservent leur éclat pendant plusieurs années sans aucun entretien.',
      price: 25000,
      stock: 3,
      estimatedDelivery: '24h',
      images: JSON.stringify(['https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=800']),
      isCustomizable: true,
      customFieldPlaceholder: 'Texte court sur le ruban',
      categoryId: catOccasions.id,
    },
  }));

  // Panier Ravitaillement Essentiel
  products.push(await prisma.product.create({
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
  }));

  // Panier Premium
  products.push(await prisma.product.create({
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
  }));

  console.log('Produits créés.');

  // 7. Génération de commandes réalistes (2025 et 2026)
  console.log('Génération des commandes...');
  const currentYear = new Date().getFullYear();

  // Liste ordonnée de configuration d'ordres par mois
  // [Année, Mois (0-indexed), Nombre de commandes]
  const ordersConfig = [
    // Année 2025
    { y: currentYear - 1, m: 0, count: 2 }, // Jan
    { y: currentYear - 1, m: 1, count: 2 }, // Fév
    { y: currentYear - 1, m: 2, count: 1 }, // Mar
    { y: currentYear - 1, m: 3, count: 3 }, // Avr
    { y: currentYear - 1, m: 4, count: 2 }, // Mai
    { y: currentYear - 1, m: 5, count: 3 }, // Juin
    { y: currentYear - 1, m: 6, count: 2 }, // Juil
    { y: currentYear - 1, m: 7, count: 2 }, // Août
    { y: currentYear - 1, m: 8, count: 1 }, // Sept
    { y: currentYear - 1, m: 9, count: 3 }, // Oct
    { y: currentYear - 1, m: 10, count: 2 }, // Nov
    { y: currentYear - 1, m: 11, count: 5 }, // Déc (Fort volume fêtes)

    // Année 2026 (En cours)
    { y: currentYear, m: 0, count: 3 }, // Jan
    { y: currentYear, m: 1, count: 4 }, // Fév
    { y: currentYear, m: 2, count: 3 }, // Mar
    { y: currentYear, m: 3, count: 4 }, // Avr
    { y: currentYear, m: 4, count: 4 }, // Mai
    { y: currentYear, m: 5, count: 5 }, // Juin (Mois courant)
  ];

  let orderCount = 0;

  // Distribution des clients pour simuler des clients fidèles (qui commandent plusieurs fois)
  // et des nouveaux clients (qui ne commandent qu'une fois)
  // Index clients récurrents : 0, 1, 2, 3, 4, 5
  // Index clients uniques : 6, 7, 8, 9
  const getClientForOrder = (index: number) => {
    const recurrentIndex = index % 6; // Tourne sur les 6 premiers
    const isRecurrent = index % 3 !== 0; // 66% de chances d'être un client récurrent
    if (isRecurrent) {
      return customers[recurrentIndex];
    } else {
      const uniqueIndex = 6 + (Math.floor(index / 3) % 4); // Tourne sur les 4 derniers
      return customers[uniqueIndex];
    }
  };

  for (const config of ordersConfig) {
    for (let i = 0; i < config.count; i++) {
      orderCount++;
      const client = getClientForOrder(orderCount);
      const zone = zones[orderCount % zones.length];

      // Choix du statut de la commande en fonction de sa date
      let status = OrderStatus.LIVREE;
      if (config.y === currentYear && config.m === 5) {
        // Mois courant (Juin 2026) : variété de statuts actifs
        const activeStatuses = [OrderStatus.EN_ATTENTE, OrderStatus.PAYEE, OrderStatus.EN_PREPARATION, OrderStatus.EXPEDIEE, OrderStatus.LIVREE];
        status = activeStatuses[i % activeStatuses.length];
      } else {
        // Commandes passées : 90% LIVREE, 10% ANNULEE
        status = i % 10 === 0 ? OrderStatus.ANNULEE : OrderStatus.LIVREE;
      }

      // Code promo aléatoire (15% de chances)
      let promo = null;
      if (orderCount % 7 === 0) {
        promo = orderCount % 2 === 0 ? promoCadeau : promoFete;
      }

      // Date précise dans le mois
      const date = new Date();
      date.setFullYear(config.y);
      date.setMonth(config.m);
      date.setDate(1 + (i * 5) % 28);
      date.setHours(10 + (i % 12), (i * 13) % 60, 0, 0);

      // Génération des articles (1 à 2 produits par commande)
      const numItems = 1 + (orderCount % 2);
      const itemsData = [];
      let subtotal = 0;

      for (let j = 0; j < numItems; j++) {
        const prod = products[(orderCount + j) % products.length];
        const qty = 1 + (orderCount % 2 === 0 && j === 0 ? 1 : 0); // quantité 1 ou 2
        subtotal += prod.price * qty;
        itemsData.push({
          productId: prod.id,
          quantity: qty,
          price: prod.price,
          customizationMessage: prod.isCustomizable ? `Texte personnalisé pour ${client.name}` : null,
        });
      }

      // Calcul des réductions
      let discount = 0;
      if (promo) {
        if (promo.discountType === DiscountType.FIXED) {
          discount = promo.discountValue;
        } else {
          discount = Math.round((subtotal * promo.discountValue) / 100);
        }
      }

      const totalAmount = Math.max(0, subtotal + zone.deliveryFee - discount);

      // Création de la commande
      const order = await prisma.order.create({
        data: {
          orderNumber: getUniqueOrderNumber(),
          userId: client.id,
          status: status,
          totalAmount: totalAmount,
          shippingFee: zone.deliveryFee,
          shippingZoneId: zone.id,
          clientName: client.name,
          clientEmail: client.email,
          clientPhone: client.phone,
          shippingAddress: client.address || 'Adresse Bénin',
          transactionId: status !== OrderStatus.EN_ATTENTE ? `FP-TX-${10000 + orderCount}` : null,
          promoCodeId: promo ? promo.id : null,
          createdAt: date,
          updatedAt: date,
        },
      });

      // Création des articles de commande
      for (const item of itemsData) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            customizationMessage: item.customizationMessage,
          },
        });
      }
    }
  }

  console.log(`${orderCount} commandes créées.`);
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
