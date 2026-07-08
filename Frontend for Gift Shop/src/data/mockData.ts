export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  deliveryDays: string;
  isPersonalizable: boolean;
  isPopular: boolean;
  isActive: boolean;
  tags: string[];
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number;
}

export const categories: Category[] = [
  { id: "1", name: "Anniversaire", emoji: "🎂", slug: "anniversaire", description: "Surprenez vos proches pour leur grand jour" },
  { id: "2", name: "Mariage", emoji: "💍", slug: "mariage", description: "Des cadeaux élégants pour les mariés" },
  { id: "3", name: "Naissance", emoji: "👶", slug: "naissance", description: "Célébrez l'arrivée d'un nouveau-né" },
  { id: "4", name: "Entreprise", emoji: "🏢", slug: "entreprise", description: "Goodies et récompenses corporate" },
  { id: "5", name: "Saint-Valentin", emoji: "❤️", slug: "saint-valentin", description: "Exprimez votre amour avec style" },
  { id: "6", name: "Fête", emoji: "🎉", slug: "fete", description: "Pour toutes les occasions festives" },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "coffret-cadeau-luxe-premium",
    name: "Coffret Cadeau Luxe Premium",
    description: "Un magnifique coffret tout-en-un contenant des délices artisanaux, une bougie parfumée et une carte personnalisée. Idéal pour marquer une occasion spéciale avec élégance.",
    price: 35000,
    originalPrice: 42000,
    category: "anniversaire",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 15,
    deliveryDays: "2-3 jours",
    isPersonalizable: true,
    isPopular: true,
    isActive: true,
    tags: ["luxe", "coffret", "anniversaire"],
  },
  {
    id: "2",
    slug: "bouquet-roses-premium-50-tiges",
    name: "Bouquet de Roses Premium 50 Tiges",
    description: "Un somptueux bouquet de 50 roses fraîches soigneusement sélectionnées, livré avec un emballage élégant. La déclaration florale parfaite pour impressionner.",
    price: 28000,
    category: "saint-valentin",
    images: [
      "https://images.unsplash.com/photo-1681183183825-cf959ebdc3c2?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1713998525908-69c60daae07d?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 20,
    deliveryDays: "1-2 jours",
    isPersonalizable: true,
    isPopular: true,
    isActive: true,
    tags: ["fleurs", "roses", "romantique"],
  },
  {
    id: "3",
    slug: "coffret-parfum-fleurs-elegance",
    name: "Coffret Parfum & Fleurs Élégance",
    description: "L'association parfaite : un flacon de parfum de luxe accompagné d'un bouquet de fleurs fraîches. Un cadeau double qui saura toucher le cœur.",
    price: 45000,
    category: "anniversaire",
    images: [
      "https://images.unsplash.com/photo-1713998576695-379669c88439?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1713999536891-335a3cc9a54f?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 8,
    deliveryDays: "2-3 jours",
    isPersonalizable: true,
    isPopular: true,
    isActive: true,
    tags: ["parfum", "luxe", "fleurs"],
  },
  {
    id: "4",
    slug: "box-chocolats-artisanaux-benin",
    name: "Box Chocolats Artisanaux du Bénin",
    description: "Une sélection exclusive de 24 chocolats artisanaux fabriqués avec du cacao béninois. Un voyage gustatif unique entre tradition et modernité.",
    price: 18000,
    category: "fete",
    images: [
      "https://images.unsplash.com/photo-1667104234787-59112f0e11ec?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1544639044-4f142ceb6a2b?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 30,
    deliveryDays: "1-2 jours",
    isPersonalizable: false,
    isPopular: true,
    isActive: true,
    tags: ["chocolats", "artisanal", "cacao"],
  },
  {
    id: "5",
    slug: "mug-personnalise-premium",
    name: "Mug Personnalisé Premium",
    description: "Un mug en céramique de haute qualité personnalisé avec le prénom, un message ou une photo au choix. La touche personnelle qui fait toute la différence.",
    price: 8500,
    category: "anniversaire",
    images: [
      "https://images.unsplash.com/photo-1592903297149-37fb25202dfa?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 50,
    deliveryDays: "3-5 jours",
    isPersonalizable: true,
    isPopular: false,
    isActive: true,
    tags: ["mug", "personnalisé", "quotidien"],
  },
  {
    id: "6",
    slug: "peluche-geante-coeur-rouge",
    name: "Peluche Géante Coeur Rouge",
    description: "Une adorable peluche en forme de cœur, toute douce et enveloppante. Sa taille généreuse (60cm) en fait un cadeau qui marque les esprits et les cœurs.",
    price: 22000,
    category: "saint-valentin",
    images: [
      "https://images.unsplash.com/photo-1671150590216-f138600130ce?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 12,
    deliveryDays: "1-2 jours",
    isPersonalizable: false,
    isPopular: true,
    isActive: true,
    tags: ["peluche", "romantique", "coeur"],
  },
  {
    id: "7",
    slug: "coffret-beaute-complet-femme",
    name: "Coffret Beauté Complet Femme",
    description: "Un coffret beauté premium regroupant crèmes hydratantes, huiles essentielles, masques et accessoires de soin. Offrez l'expérience spa à domicile.",
    price: 38000,
    category: "anniversaire",
    images: [
      "https://images.unsplash.com/photo-1523432149071-adace963c5e4?w=600&h=600&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1598121535437-37bbc4748e1a?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 10,
    deliveryDays: "2-3 jours",
    isPersonalizable: false,
    isPopular: true,
    isActive: true,
    tags: ["beauté", "spa", "soin"],
  },
  {
    id: "8",
    slug: "pack-naissance-bebe-complet",
    name: "Pack Naissance Bébé Complet",
    description: "Tout ce qu'il faut pour accueillir le nouveau-né : body, doudou, couverture douce, chaussons et accessoires de soin, le tout joliment emballé.",
    price: 32000,
    category: "naissance",
    images: [
      "https://images.unsplash.com/photo-1512101147095-d05249ea9a04?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 18,
    deliveryDays: "2-3 jours",
    isPersonalizable: true,
    isPopular: true,
    isActive: true,
    tags: ["bébé", "naissance", "naissance"],
  },
  {
    id: "9",
    slug: "coffret-vin-fromages-prestige",
    name: "Coffret Vin & Fromages Prestige",
    description: "Une sélection gastronomique raffinée : deux bouteilles de vin importé, fromages fins et crackers artisanaux dans un coffret bois gravé.",
    price: 52000,
    originalPrice: 60000,
    category: "entreprise",
    images: [
      "https://images.unsplash.com/photo-1646565813087-9741814be3f6?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 6,
    deliveryDays: "2-4 jours",
    isPersonalizable: true,
    isPopular: false,
    isActive: true,
    tags: ["vin", "gastronomie", "prestige"],
  },
  {
    id: "10",
    slug: "bougie-parfumee-luxe-ambre",
    name: "Bougie Parfumée Luxe à l'Ambre",
    description: "Une bougie artisanale à la cire de soja avec des notes enveloppantes d'ambre, de bois de santal et de vanille. 60 heures de diffusion douce.",
    price: 12000,
    category: "fete",
    images: [
      "https://images.unsplash.com/photo-1674620213535-9b2a2553ef40?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 25,
    deliveryDays: "1-2 jours",
    isPersonalizable: true,
    isPopular: false,
    isActive: true,
    tags: ["bougie", "ambiance", "artisanal"],
  },
  {
    id: "11",
    slug: "coffret-goodies-entreprise-logo",
    name: "Coffret Goodies Entreprise Personnalisé",
    description: "Pack corporate professionnel : carnet, stylo, mug et tote bag personnalisés aux couleurs de votre entreprise. Minimum 10 unités, idéal pour vos collaborateurs.",
    price: 15000,
    category: "entreprise",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 100,
    deliveryDays: "5-7 jours",
    isPersonalizable: true,
    isPopular: true,
    isActive: true,
    tags: ["corporate", "goodies", "entreprise"],
  },
  {
    id: "12",
    slug: "alliance-mariage-cadeau-couple",
    name: "Coffret Mariage Alliance & Cristaux",
    description: "Un coffret mariage somptueux comprenant une boîte à alliance en bois gravé, des cristaux décoratifs et une carte de vœux calligraphiée.",
    price: 42000,
    category: "mariage",
    images: [
      "https://images.unsplash.com/photo-1544639044-4f142ceb6a2b?w=600&h=600&fit=crop&auto=format",
    ],
    stock: 7,
    deliveryDays: "3-5 jours",
    isPersonalizable: true,
    isPopular: false,
    isActive: true,
    tags: ["mariage", "alliance", "cristaux"],
  },
];

export const deliveryZones: DeliveryZone[] = [
  { id: "1", name: "Cotonou Centre (Plateau, Ganhi)", price: 1000 },
  { id: "2", name: "Cotonou Nord (Akpakpa, Fidjrossè)", price: 1500 },
  { id: "3", name: "Cotonou Est (Cadjèhoun, Agla)", price: 1500 },
  { id: "4", name: "Cotonou Ouest (Godomey, Agodjè)", price: 2000 },
  { id: "5", name: "Abomey-Calavi", price: 2500 },
  { id: "6", name: "Porto-Novo", price: 3000 },
  { id: "7", name: "Parakou", price: 5000 },
  { id: "8", name: "Bohicon / Abomey", price: 4500 },
  { id: "9", name: "Ouidah", price: 3500 },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
