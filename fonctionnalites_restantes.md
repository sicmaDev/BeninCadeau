# Fonctionnalités MVP Restantes – Bénin Cadeau

Ce document récapitule les fonctionnalités prioritaires définies dans le cahier des charges MVP qui restent à finaliser ou à intégrer avant la mise en ligne.

---

## 1. 🛍️ Interface Client (Front-end)

- [ ] **Bouton WhatsApp Business flottant** :
  - Intégrer un bouton flottant WhatsApp visible sur toutes les pages du site pour faciliter le contact direct.
- [ ] **Bouton "Commander via WhatsApp" sur la fiche produit** :
  - Sur chaque produit, ajouter un bouton de commande directe via WhatsApp (générant un lien prérempli avec le nom du produit et le lien de la page).
- [ ] **Espace Compte Client (`/compte`)** :
  - Connexion et inscription fonctionnelle (e-mail + mot de passe).
  - Affichage de l'historique des commandes passées avec leur statut en temps réel (*En attente*, *Payée*, *En préparation*, *Expédiée*, *Livrée*, *Annulée*).
  - Formulaire de modification du profil client (nom, téléphone, adresse de livraison par défaut).
- [ ] **Redirection post-paiement et confirmation** :
  - S'assurer que le client est correctement redirigé vers la page `/confirmation` avec son numéro de commande après un paiement FedaPay réussi.

---

## 2. 🛡️ Back-office Administrateur (`/admin`)

- [ ] **Sécurisation des accès Admin** :
  - Mettre en place un écran de connexion (`/admin/login` ou via NextAuth) pour l'espace administrateur.
  - Sécuriser l'accès aux dossiers `/admin/*` et aux routes API `/api/admin/*` en vérifiant le rôle `ADMIN`.
- [ ] **Gestion des Produits** :
  - Finaliser les actions de création (Ajout), modification et désactivation/activation de produits.
  - Intégrer le système d'upload de photos dans les formulaires d'administration.

---

## 3. 🚀 Finition, SEO & Mise en production

- [ ] **Configuration SMTP & FedaPay réels** :
  - Remplacer les configurations de test FedaPay (Sandbox) et d'e-mail (Mailtrap) par les clés de production en environnement réel.
- [ ] **SEO de base** :
  - S'assurer que chaque page a un titre `<title>` unique et une balise `meta description`.
  - Ajouter des balises `alt` descriptives sur toutes les images.
  - Vérifier la génération dynamique du fichier `sitemap.xml`.
