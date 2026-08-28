# Plan d'implémentation - Initialisation de la Base de Données (Phase 1)

Ce document décrit le plan pour configurer la base de données MySQL locale et établir la connexion avec l'application Next.js en utilisant l'ORM **Prisma**.

## User Review Required

> [!IMPORTANT]
> Nous allons utiliser l'ORM **Prisma** car il s'intègre parfaitement avec Next.js et TypeScript. Cela implique l'ajout de dépendances dans `package.json` (`prisma` et `@prisma/client`).
> Les identifiants MySQL fournis par l'utilisateur seront configurés dans un fichier `.env`.
> 
> Merci de valider le schéma de base de données proposé ci-dessous avant que nous procédions à l'exécution.

## Proposed Changes

### Configuration du Projet et Dépendances

#### [MODIFY] [package.json](file:///home/mr-lazare/Documents/BeninCadeau/benin-cadeau-next/package.json)
Ajout des dépendances Prisma :
*   `dependencies` : `@prisma/client`
*   `devDependencies` : `prisma`

#### [NEW] [.env](file:///home/mr-lazare/Documents/BeninCadeau/benin-cadeau-next/.env)
Création du fichier d'environnement local contenant la chaîne de connexion MySQL :
```env
DATABASE_URL="mysql://utilisateur:mot_de_passe@localhost:3306/benin-cadeau"
```

---

### Schéma de Base de Données

#### [NEW] [schema.prisma](file:///home/mr-lazare/Documents/BeninCadeau/benin-cadeau-next/prisma/schema.prisma)
Définition des modèles de données en accord avec le cahier des charges :

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum UserRole {
  ADMIN
  CUSTOMER
}

enum OrderStatus {
  EN_ATTENTE
  PAYEE
  EN_PREPARATION
  EXPEDIEE
  LIVREE
  ANNULEE
}

enum DiscountType {
  FIXED
  PERCENTAGE
}

model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  phone        String?
  address      String?
  role         UserRole @default(CUSTOMER)
  orders       Order[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Category {
  id           Int       @id @default(autoincrement())
  name         String
  slug         String    @unique
  active       Boolean   @default(true)
  displayOrder Int       @default(0)
  products     Product[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Product {
  id                      Int         @id @default(autoincrement())
  name                    String
  slug                    String      @unique
  description             String      @db.Text
  price                   Int
  stock                   Int         @default(0)
  estimatedDelivery       String
  images                  Json // Stocke un tableau d'URLs d'images
  isCustomizable          Boolean     @default(false)
  customFieldPlaceholder String?
  active                  Boolean     @default(true)
  categoryId              Int
  category                Category    @relation(fields: [categoryId], references: [id])
  orderItems              OrderItem[]
  createdAt               DateTime    @default(now())
  updatedAt               DateTime    @updatedAt
}

model ShippingZone {
  id          Int      @id @default(autoincrement())
  name        String
  deliveryFee Int
  orders      Order[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PromoCode {
  id            Int          @id @default(autoincrement())
  code          String       @unique
  discountType  DiscountType
  discountValue Int // Valeur absolue ou pourcentage
  active        Boolean      @default(true)
  expiresAt     DateTime
  orders        Order[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Order {
  id             Int          @id @default(autoincrement())
  orderNumber    String       @unique
  userId         Int?
  user           User?        @relation(fields: [userId], references: [id])
  status         OrderStatus  @default(EN_ATTENTE)
  totalAmount    Int
  shippingFee    Int
  shippingZoneId Int
  shippingZone   ShippingZone @relation(fields: [shippingZoneId], references: [id])
  clientName     String
  clientEmail    String
  clientPhone    String
  shippingAddress String      @db.Text
  transactionId  String?      @unique // ID de transaction FedaPay
  promoCodeId    Int?
  promoCode      PromoCode?   @relation(fields: [promoCodeId], references: [id])
  orderItems     OrderItem[]
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model OrderItem {
  id                   Int     @id @default(autoincrement())
  orderId              Int
  order                Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId            Int
  product              Product @relation(fields: [productId], references: [id])
  quantity             Int
  price                Int // Prix du produit au moment de la commande
  customizationMessage String? @db.Text
}
```

---

### Connexion et Service de Base de Données

#### [NEW] [db.ts](file:///home/mr-lazare/Documents/BeninCadeau/benin-cadeau-next/src/utils/db.ts)
Création d'un client Prisma global pour éviter de multiplier les connexions en mode développement dans Next.js :
```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## Verification Plan

### Automated Tests
*   **Initialisation & Génération de Prisma** : Exécution de `npx prisma db push` (ou création d'une migration avec `npx prisma migrate dev`) pour valider la connexion MySQL et appliquer le schéma sur la base de données locale `benin-cadeau`.
*   **Vérification de la base MySQL** : Exécution de `mysql -u lazare -ppeya123 -e "USE \`benin-cadeau\`; SHOW TABLES;"` pour confirmer la bonne création de toutes les tables.
