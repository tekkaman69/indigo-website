# Marketplace Indigo - Documentation

## Vue d'ensemble

Un marketplace complet pour vendre des services standardisés avec paiement LemonSqueezy, suivi par lien magique et gestion administrative.

## Architecture

### Collections Firestore

- **services/** - Catalogue de services
- **orders/** - Commandes clients
- **order_messages/** - Messages et communications
- **order_files/** - Fichiers de livraison

### Pages Publiques

- `/services` - Catalogue de services avec filtres par catégorie
- `/services/cart` - Panier et formulaire de commande (multi-étapes)
- `/order/[token]` - Suivi de commande via lien magique (sans login)
- `/order/success` - Confirmation après paiement

### Pages Admin

- `/admin/services` - Gestion du catalogue (CRUD services + form builder)
- `/admin/orders` - Liste des commandes (filtres par statut)
- `/admin/orders/[id]` - Détail commande (changement statut, messages, upload fichiers)

### API Routes

- `POST /api/checkout` - Créer session LemonSqueezy
- `POST /api/webhook/lemon` - Webhook paiement LemonSqueezy
- `GET /api/orders/[token]` - Récupérer commande par token

## Fonctionnalités Implémentées

### ✅ Phase 1: Structure de Base
- Types TypeScript complets (`src/types/marketplace.ts`)
- Fonctions Firestore CRUD (`src/lib/firebase/marketplace.ts`)

### ✅ Phase 2: Panier
- Hook `useCart` avec localStorage (`src/hooks/useCart.ts`)
- Composant `CartDrawer` (`src/components/marketplace/CartDrawer.tsx`)

### ✅ Phase 3: Pages Publiques
- Catalogue services avec filtres catégories
- Panier/checkout avec formulaire multi-étapes et questions dynamiques
- Page suivi commande accessible via lien magique
- Page success après paiement

### ✅ Phase 4: Admin Services
- Interface CRUD pour gérer les services
- Form builder pour créer des questions personnalisées
- Support 4 types de questions: texte court, texte long, select, multi-select

### ✅ Phase 5: Admin Commandes
- Liste des commandes avec onglets par statut
- Page détail avec timeline, messages, fichiers
- Upload de fichiers de livraison
- Changement de statut avec notifications système

### ✅ Phase 6: API Routes
- Route checkout avec validation et rate limiting
- Webhook LemonSqueezy avec vérification signature
- Route récupération commande par token

### ✅ Phase 7: LemonSqueezy Integration
- Client LemonSqueezy (`src/lib/lemonsqueezy.ts`)
- Création checkout sessions
- Vérification webhooks
- Mode développement (sans config LemonSqueezy)

## Configuration Requise

### Variables d'Environnement

Créer/modifier `.env.local` avec:

```env
# Firebase (déjà configuré)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# LemonSqueezy (à configurer)
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_VARIANT_ID=your_variant_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Configuration LemonSqueezy (Guide Complet)

#### 1. Créer un compte
- Aller sur https://lemonsqueezy.com
- S'inscrire et créer un compte

#### 2. Créer un Store
- Menu: Settings > Stores
- Créer un nouveau store
- Noter le **Store ID**

#### 3. Créer un Produit
- Menu: Products > New Product
- Nom: "Services Indigo" (ou autre)
- Type: "Single Payment"
- Noter le **Product ID**

#### 4. Créer une Variante
- Dans votre produit, créer une variante
- Prix: mettre un prix (sera remplacé par le montant dynamique)
- Noter le **Variant ID**

#### 5. Générer une API Key
- Menu: Settings > API
- Créer une nouvelle clé API
- Copier la clé (elle ne sera plus visible après!)
- C'est votre **API Key**

#### 6. Configurer le Webhook
- Menu: Settings > Webhooks
- Ajouter endpoint: `https://votre-domaine.com/api/webhook/lemon`
- Sélectionner événements:
  - `order_created`
  - `order_paid`
  - `order_refunded`
- Copier le **Signing Secret**

#### 7. Tester l'Intégration
- Utiliser le mode test de LemonSqueezy
- Créer une commande test
- Vérifier que le statut s'update dans Firestore

## Flow Utilisateur

### Client
1. Visite `/services` et ajoute des services au panier
2. Clique "Commander" → redirigé vers `/services/cart`
3. Remplit les questions par service (si configurées)
4. Saisit nom et email
5. Clique "Procéder au paiement" → redirigé vers LemonSqueezy
6. Paie sur LemonSqueezy
7. Redirigé vers `/order/success`
8. Reçoit email de LemonSqueezy avec lien magique `/order/[token]`
9. Consulte la page de suivi pour voir statut, messages, et fichiers

### Admin
1. Se connecte via `/login`
2. Crée des services dans `/admin/services`
3. Reçoit des commandes visibles dans `/admin/orders`
4. Ouvre détail commande `/admin/orders/[id]`
5. Change statut: pending → paid → in_progress → delivered
6. Envoie des messages au client
7. Upload des fichiers finaux
8. Client voit tout sur sa page de suivi

## Structure des Types

### Service
```typescript
{
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  price: number;
  deliveryTime: number; // jours
  formSchema: FormQuestion[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order
```typescript
{
  id: string;
  orderId: string; // Format: ORD-XXXXXX
  magicToken: string; // UUID pour accès
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  lemonSqueezyOrderId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### FormQuestion
```typescript
{
  id: string;
  label: string;
  type: 'short_text' | 'long_text' | 'select' | 'multiple_select';
  required: boolean;
  options?: string[]; // Pour select/multiple_select
  placeholder?: string;
}
```

## Règles de Sécurité Firestore

**Important**: Mettre à jour les règles Firestore pour sécuriser l'accès:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Services: lecture publique, écriture admin uniquement
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
    }

    // Orders: lecture par magicToken uniquement, écriture admin + API
    match /orders/{orderId} {
      allow read: if resource.data.magicToken == request.query.token;
      allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
    }

    // Order Messages: lecture par magicToken, écriture admin
    match /order_messages/{messageId} {
      allow read: if exists(/databases/$(database)/documents/orders/$(resource.data.orderId))
                  && get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.magicToken == request.query.token;
      allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
    }

    // Order Files: lecture par magicToken, écriture admin
    match /order_files/{fileId} {
      allow read: if exists(/databases/$(database)/documents/orders/$(resource.data.orderId))
                  && get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.magicToken == request.query.token;
      allow write: if request.auth != null && request.auth.uid == 'ADMIN_UID';
    }
  }
}
```

Remplacer `ADMIN_UID` par l'UID Firebase de l'admin.

## Mode Développement

Le système fonctionne **sans configuration LemonSqueezy** en mode développement:

- L'API checkout redirige directement vers `/order/success`
- Le webhook accepte les requêtes sans vérification de signature
- Permet de tester tout le flow sans compte LemonSqueezy

Pour activer le mode production, il suffit de configurer les variables d'environnement LemonSqueezy.

## Prochaines Étapes

1. **Configurer LemonSqueezy**
   - Suivre le guide ci-dessus
   - Ajouter les variables d'environnement
   - Tester avec mode test

2. **Créer le premier service**
   - Se connecter en admin
   - Aller sur `/admin/services`
   - Créer un service de test
   - Ajouter des questions si nécessaire

3. **Tester le flow complet**
   - Ajouter service au panier
   - Passer commande
   - Vérifier email LemonSqueezy
   - Accéder via lien magique
   - Tester changement statut admin

4. **Mettre à jour les règles Firestore**
   - Copier les règles ci-dessus
   - Remplacer ADMIN_UID
   - Déployer dans Firebase Console

5. **Configurer les emails** (optionnel)
   - Les emails de confirmation sont envoyés par LemonSqueezy automatiquement
   - Personnaliser les templates dans LemonSqueezy > Settings > Emails

## Support

Pour toute question sur l'implémentation:
- Vérifier les logs dans la console navigateur
- Vérifier les logs Firebase Functions (si utilisées)
- Vérifier les logs LemonSqueezy Dashboard
- Les messages d'erreur détaillés sont dans les toasts et console

## Fichiers Clés

### Frontend
- `src/app/services/page.tsx` - Catalogue
- `src/app/services/cart/page.tsx` - Panier/checkout
- `src/app/order/[token]/page.tsx` - Suivi commande
- `src/hooks/useCart.ts` - Logique panier

### Admin
- `src/app/admin/services/page.tsx` - Gestion services
- `src/app/admin/orders/page.tsx` - Liste commandes
- `src/app/admin/orders/[id]/page.tsx` - Détail commande

### Backend
- `src/lib/firebase/marketplace.ts` - CRUD Firestore
- `src/lib/lemonsqueezy.ts` - Client LemonSqueezy
- `src/app/api/checkout/route.ts` - API checkout
- `src/app/api/webhook/lemon/route.ts` - Webhook handler

### Types
- `src/types/marketplace.ts` - Toutes les définitions de types
