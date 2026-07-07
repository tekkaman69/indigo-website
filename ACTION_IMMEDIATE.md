# 🚨 ACTION IMMÉDIATE REQUISE

## Situation actuelle

Vous avez créé un service mais il n'apparaît pas sur `/services`.

**Erreurs dans la console:**
```
1. Missing or insufficient permissions
2. The query requires an index
```

## Cause

Les règles et index Firestore ne sont **pas encore déployés**.
Les fichiers locaux (`firestore.rules`, `firestore.indexes.json`) ne sont pas automatiquement appliqués.

---

## 🔥 ACTION À FAIRE MAINTENANT (5 minutes)

### Option A: Console Firebase (Recommandé)

#### 1️⃣ Déployer les règles (2 min)

**Lien direct:**
https://console.firebase.google.com/project/indigo-website-dde24/firestore/rules

**Étapes:**
1. Cliquer sur le lien ci-dessus
2. Remplacer **tout le contenu** par:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Portfolio collection
    match /portfolio/{document=**} {
      allow read, write: if true;
    }

    // Assets collection
    match /assets/{assetId} {
      allow read: if true;
      allow write: if true;
      allow delete: if true;
    }

    // Contact messages
    match /contact-messages/{document=**} {
      allow read, write: if true;
    }

    // Contacts (nouveau système)
    match /contacts/{contactId} {
      allow read, write: if true;
    }

    // Services - Marketplace
    match /services/{serviceId} {
      allow read: if true;
      allow create, update, delete: if true;
    }

    // Orders - Marketplace
    match /orders/{orderId} {
      allow read, write: if true;
    }

    // Order Messages - Marketplace
    match /order_messages/{messageId} {
      allow read, write: if true;
    }

    // Order Files - Marketplace
    match /order_files/{fileId} {
      allow read, write: if true;
    }

    // Testimonials
    match /testimonials/{testimonialId} {
      allow read, write: if true;
    }
  }
}
```

3. Cliquer **Publier** (Publish)
4. ✅ Attendre confirmation

#### 2️⃣ Créer l'index (2 min)

**Lien direct dans votre erreur:**

Votre console affiche un lien qui ressemble à:
```
https://console.firebase.google.com/v1/r/project/indigo-website-dde24/firestore/indexes?create_composite=...
```

**Étapes:**
1. Copier le lien complet depuis votre console
2. Coller dans le navigateur
3. Cliquer **Créer l'index**
4. Attendre 1-2 minutes (barre de progression)
5. ✅ État: "Créé"

**OU via la console:**

**Lien direct:**
https://console.firebase.google.com/project/indigo-website-dde24/firestore/indexes

**Étapes:**
1. Cliquer sur le lien
2. Cliquer **Créer un index**
3. Remplir:
   - Collection: `services`
   - Champ 1: `active` → **Croissant**
   - Champ 2: `createdAt` → **Décroissant**
4. Cliquer **Créer**
5. Attendre 1-2 minutes
6. ✅ État: "Créé"

#### 3️⃣ Tester (30 sec)

1. Retourner sur `http://localhost:9002/services`
2. **Ctrl + Shift + R** (hard refresh)
3. ✅ Les services devraient apparaître!

---

### Option B: Firebase CLI (Alternative)

Si vous préférez la ligne de commande:

```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialiser (si première fois)
firebase init firestore

# Sélectionner:
# ✅ firestore.rules
# ✅ firestore.indexes.json

# Déployer
firebase deploy --only firestore
```

Attendre ~30 secondes, puis rafraîchir `/services`.

---

## ✅ Vérification que tout fonctionne

### Test 1: Console Firebase

**Règles:**
- https://console.firebase.google.com/project/indigo-website-dde24/firestore/rules
- ✅ Devrait contenir `match /services/{serviceId}`

**Index:**
- https://console.firebase.google.com/project/indigo-website-dde24/firestore/indexes
- ✅ Index `services` avec état **Créé** (vert)

### Test 2: Application

**Page Services (`/services`):**
- ✅ Pas d'erreur dans la console (F12)
- ✅ Services affichés dans la grille
- ✅ Peut ajouter au panier

**Admin Services (`/admin/services`):**
- ✅ Liste des services visible
- ✅ Peut créer un nouveau service
- ✅ Peut modifier un service existant
- ✅ Upload image fonctionne

### Test 3: Console navigateur

Ouvrir la console (F12):
- ❌ Plus d'erreur `Missing or insufficient permissions`
- ❌ Plus d'erreur `requires an index`
- ✅ Logs `[STORAGE]` pour les uploads (si vous uploadez une image)

---

## 🎯 Après ces actions

Une fois les règles et index déployés:

### ✅ Ce qui fonctionne immédiatement
- Créer des services dans `/admin/services`
- Voir les services sur `/services`
- Upload d'images pour les services
- Ajouter au panier
- Créer des commandes (marketplace)

### ⚠️ À faire plus tard (production)

**Sécuriser les règles Firestore:**
1. Trouver votre UID admin (Console Firebase → Authentication)
2. Remplacer `if true` par `if isAdmin()` dans les règles
3. Voir le guide complet: `DEPLOYER_REGLES_FIRESTORE.md`

**Configurer LemonSqueezy:**
1. Créer compte LemonSqueezy
2. Configurer produit et webhook
3. Ajouter les variables d'environnement
4. Voir le guide: `MARKETPLACE_README.md`

---

## 📚 Documentation disponible

- **`FIX_RAPIDE_FIRESTORE.md`** - Guide visuel pour fix rapide
- **`DEPLOYER_REGLES_FIRESTORE.md`** - Guide complet règles + sécurité
- **`MARKETPLACE_README.md`** - Documentation marketplace complète
- **`MARKETPLACE_FIXES.md`** - Rapport des corrections apportées

---

## ❓ Si ça ne marche toujours pas

### Erreur persiste après déploiement

1. **Vider le cache:**
   - Chrome: Ctrl + Shift + Del → Cocher "Cookies" → Effacer
   - Firefox: Ctrl + Shift + Del → Tout
   - OU Mode incognito

2. **Se déconnecter/reconnecter:**
   - Cliquer sur le bouton logout admin
   - Se reconnecter

3. **Vérifier le déploiement:**
   - Console Firebase → Règles → Voir la date de dernière publication
   - Doit être < 5 minutes
   - Si ancienne → Re-publier

### Index toujours "En cours de création"

Attendre 2-3 minutes supplémentaires.
Si toujours "En cours" après 5 minutes → Supprimer et recréer.

### Autre erreur

1. Noter l'erreur exacte (console F12)
2. Copier le message d'erreur complet
3. Vérifier qu'il n'y a pas d'erreur de typo dans les règles

---

## 🚀 Résumé TL;DR

```
1. Firebase Console → Firestore → Règles → Copier/Coller → Publier
2. Cliquer lien index dans console → Créer index → Attendre
3. Refresh /services (Ctrl+Shift+R)
4. ✅ DONE
```

**Temps: 5 minutes**
**Résultat: Marketplace fonctionnel** 🎉
