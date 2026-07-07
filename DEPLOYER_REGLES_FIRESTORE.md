# Déployer les règles Firestore - Guide rapide

## Problèmes rencontrés

### 1. Permissions insuffisantes
```
FirebaseError: Missing or insufficient permissions
```
→ Les règles Firestore bloquent l'accès à `services`

### 2. Index manquant
```
FirebaseError: The query requires an index
```
→ Firestore nécessite un index pour les requêtes avec tri

## Solution: Déployer règles + index

### Méthode 1: Via la Console Firebase (Recommandé - 5 minutes)

#### Étape A: Déployer les règles

1. **Ouvrir la Console Firebase**
   - Aller sur https://console.firebase.google.com
   - Sélectionner votre projet "indigo-website-dde24"

2. **Accéder aux règles Firestore**
   - Dans le menu latéral: **Firestore Database**
   - Onglet **Règles** (Rules)

3. **Copier-coller les nouvelles règles**
   - Ouvrir le fichier `firestore.rules` local
   - Copier tout le contenu (55 lignes)
   - Coller dans l'éditeur Firebase Console

4. **Publier**
   - Cliquer sur **Publier** (Publish)
   - Attendre confirmation (quelques secondes)
   - ✅ Règles déployées!

#### Étape B: Créer les index

**Option 1 - Clic direct (1 minute):**

L'erreur vous donne le lien! Cliquez dessus:
```
https://console.firebase.google.com/v1/r/project/indigo-website-dde24/firestore/indexes?create_composite=...
```

1. Cliquez sur le lien dans l'erreur
2. Cliquez "Créer l'index"
3. Attendez la création (1-2 minutes)
4. ✅ Index créé!

**Option 2 - Via la console (2 minutes):**

1. Firestore Database → Onglet **Index**
2. Cliquer "Créer un index"
3. Collection: `services`
4. Ajouter champs:
   - `active` → Croissant
   - `createdAt` → Décroissant
5. Cliquer "Créer"
6. Attendre 1-2 minutes
7. ✅ Index créé!

#### Étape C: Tester

1. Rafraîchir la page `/services`
2. ✅ Les services devraient s'afficher sans erreur
3. ✅ Créer un nouveau service devrait fonctionner

---

### Méthode 2: Via Firebase CLI (Pour automatisation)

#### Prérequis
```bash
npm install -g firebase-tools
firebase login
```

#### Initialiser Firebase (si pas déjà fait)
```bash
firebase init firestore
```

Sélectionner:
- ✅ Firestore Rules: `firestore.rules` (déjà créé)
- ✅ Firestore Indexes: `firestore.indexes.json`

#### Déployer les règles
```bash
firebase deploy --only firestore:rules
```

Sortie attendue:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT/overview
```

---

## Règles actuelles (Développement)

Les règles déployées sont **ouvertes pour le développement**:

```javascript
// Services - Marketplace
match /services/{serviceId} {
  allow read: if true; // ✅ Tout le monde peut lire
  allow create, update, delete: if true; // ⚠️ Temporaire
}

// Orders - Marketplace
match /orders/{orderId} {
  allow read, write: if true; // ⚠️ Temporaire
}
```

⚠️ **IMPORTANT**: Ces règles sont temporaires pour faciliter le développement.

---

## Sécuriser les règles pour la production

### Étape 1: Trouver votre UID Admin

1. Se connecter sur l'app
2. Ouvrir la Console Firebase > Authentication
3. Copier l'UID de votre compte admin
4. Exemple: `abc123def456ghi789jkl012`

### Étape 2: Mettre à jour firestore.rules

Remplacer `'YOUR_ADMIN_UID'` par votre vrai UID:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function
    function isAdmin() {
      return request.auth != null && request.auth.uid == 'abc123def456ghi789jkl012';
    }

    // Services - Lecture publique, écriture admin uniquement
    match /services/{serviceId} {
      allow read: if true;
      allow create, update, delete: if isAdmin();
    }

    // Orders - Lecture par magicToken, écriture admin/API
    match /orders/{orderId} {
      allow read: if isAdmin() ||
                     (request.auth == null &&
                      resource.data.magicToken == request.query.token);
      allow create: if true; // API checkout
      allow update, delete: if isAdmin();
    }

    // Order Messages - Sécurisé
    match /order_messages/{messageId} {
      allow read: if isAdmin() ||
                     (request.auth == null &&
                      exists(/databases/$(database)/documents/orders/$(resource.data.orderId)) &&
                      get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.magicToken == request.query.token);
      allow create, update, delete: if isAdmin();
    }

    // Order Files - Sécurisé
    match /order_files/{fileId} {
      allow read: if isAdmin() ||
                     (request.auth == null &&
                      exists(/databases/$(database)/documents/orders/$(resource.data.orderId)) &&
                      get(/databases/$(database)/documents/orders/$(resource.data.orderId)).data.magicToken == request.query.token);
      allow create, update, delete: if isAdmin();
    }

    // Portfolio - Lecture publique, écriture admin
    match /portfolio/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Contacts - Création publique, lecture admin
    match /contacts/{contactId} {
      allow read: if isAdmin();
      allow create: if true;
      allow update, delete: if isAdmin();
    }
  }
}
```

### Étape 3: Re-déployer
```bash
firebase deploy --only firestore:rules
```

---

## Vérification

### Test en développement (règles ouvertes)
1. ✅ Créer un service → doit fonctionner
2. ✅ Voir le service sur `/services` → doit fonctionner
3. ✅ Créer une commande → doit fonctionner

### Test en production (règles sécurisées)
1. ✅ Sans login: lire services → OK
2. ❌ Sans login: créer service → Interdit
3. ✅ Avec admin: créer service → OK
4. ✅ Avec magicToken: lire commande → OK
5. ❌ Sans magicToken: lire commande → Interdit

---

## En cas d'erreur après déploiement

### "Missing or insufficient permissions" persiste

**Cause possible**: Cache navigateur

**Solution**:
1. Vider le cache du navigateur
2. Hard refresh (Ctrl + Shift + R)
3. Se déconnecter et reconnecter
4. Vérifier dans Firebase Console que les règles sont bien déployées

### "Simulator errors" dans Firebase Console

**Cause**: Règles mal formatées

**Solution**:
1. Copier-coller exactement depuis `firestore.rules`
2. Vérifier les accolades `{}`
3. Vérifier les points-virgules `;`
4. Utiliser le simulateur Firebase pour tester

---

## Prochaines étapes

1. ✅ **Maintenant**: Déployer les règles de développement (tout ouvert)
2. ✅ **Test**: Créer vos premiers services
3. ✅ **Production**: Sécuriser avec votre UID admin
4. ✅ **Déployer**: Re-déployer les règles sécurisées

Le marketplace sera alors **prêt et sécurisé** pour la production! 🚀
