# Configuration de l'espace Admin protégé

**Date**: 2026-01-19
**Système d'authentification**: Firebase Auth (Email/Password)
**Restriction**: Liste d'UIDs autorisés

---

## ✅ Fichiers créés/modifiés

### Fichiers créés (4)

1. **[src/lib/admin.ts](src/lib/admin.ts)** - Configuration des admins autorisés
2. **[src/components/admin/AdminGuard.tsx](src/components/admin/AdminGuard.tsx)** - Composant de protection des routes
3. **[src/app/admin/login/page.tsx](src/app/admin/login/page.tsx)** - Page de connexion admin
4. **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Ce fichier (documentation)

### Fichiers modifiés (1)

1. **[src/app/admin/page.tsx](src/app/admin/page.tsx)** - Dashboard admin protégé par AdminGuard

---

## 🔧 Configuration requise

### 1. Ajouter votre UID admin

**⚠️ IMPORTANT - À faire en priorité**

Ouvrez [src/lib/admin.ts](src/lib/admin.ts) et remplacez `<TODO_UID>` par votre UID Firebase :

```typescript
export const ADMIN_UIDS: string[] = [
  "xXyZ1234abcd5678efgh9012ijkl3456", // ✅ Remplacez par votre UID
  // Vous pouvez ajouter plusieurs UIDs si nécessaire
];
```

#### Comment obtenir votre UID ?

**Option 1 - Via Firebase Console** (Recommandé)
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. Allez dans **Authentication** > **Users**
4. Créez un utilisateur (si pas déjà fait)
5. Copiez l'**UID** de cet utilisateur
6. Collez-le dans `ADMIN_UIDS`

**Option 2 - Via le code (après première connexion)**
1. Ajoutez temporairement dans [AdminGuard.tsx](src/components/admin/AdminGuard.tsx:30) :
   ```typescript
   console.log('Current User UID:', currentUser.uid);
   ```
2. Connectez-vous via `/admin/login`
3. Ouvrez la console du navigateur (F12)
4. Copiez l'UID affiché
5. Ajoutez-le dans `ADMIN_UIDS`
6. Supprimez le console.log

---

### 2. Configurer Firebase

Assurez-vous que votre fichier [.env.local](.env.local) contient les bonnes credentials Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_real_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

---

### 3. Activer Authentication dans Firebase

1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. Dans le menu latéral : **Authentication**
4. Cliquez sur **Get Started**
5. Activez **Email/Password** comme méthode de connexion
6. Créez un utilisateur admin :
   - Cliquez sur **Add user**
   - Email : `admin@indigo.com` (ou votre email)
   - Mot de passe : Choisissez un mot de passe sécurisé
   - Cliquez sur **Add user**
7. Copiez l'UID de cet utilisateur et ajoutez-le dans `ADMIN_UIDS`

---

## 🚀 Utilisation

### Démarrer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur : http://localhost:9002

### Routes disponibles

| Route | Description | Protection |
|-------|-------------|------------|
| `/admin/login` | Page de connexion admin | Publique |
| `/admin` | Dashboard admin | Protégée (AdminGuard + UID check) |
| `/admin/portfolio` | Gestion portfolio (à venir) | Protégée |

---

## 🔐 Sécurité - Comment ça marche ?

### Architecture de sécurité

```
┌─────────────────────────────────────┐
│  User accède à /admin               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  AdminGuard vérifie l'auth          │
│  (onAuthStateChanged)               │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   Non connecté   Connecté
        │             │
        │             ▼
        │      ┌─────────────┐
        │      │ Check UID   │
        │      └──────┬──────┘
        │             │
        │      ┌──────┴──────┐
        │      │             │
        ▼      ▼             ▼
   Redirect  UID pas     UID dans
   /login    dans liste  ADMIN_UIDS
               │             │
               ▼             ▼
         "Accès refusé"  Affiche
          + Logout       dashboard
```

### Niveaux de protection

1. **Authentification Firebase** - L'utilisateur doit être connecté
2. **Vérification UID** - L'UID doit être dans la liste `ADMIN_UIDS`
3. **Client-side guard** - Redirection immédiate si non autorisé

### États gérés

- ✅ **Loading** - Vérification en cours
- ✅ **Unauthenticated** - Non connecté → Redirect `/admin/login`
- ✅ **Not Admin** - Connecté mais UID non autorisé → Écran "Accès refusé"
- ✅ **Admin** - Authentifié ET UID autorisé → Accès au dashboard

---

## 🎨 Interface utilisateur

### Page de connexion `/admin/login`

- ✅ Formulaire email/password
- ✅ Gestion d'erreurs détaillée
- ✅ Loading state
- ✅ Toast de feedback
- ✅ Design Indigo (glassmorphism)

### Dashboard `/admin`

- ✅ Carte Portfolio (lien vers `/admin/portfolio`)
- ✅ Carte Déconnexion
- ✅ Carte Informations
- ✅ Design premium avec gradients

### Écran "Accès refusé"

- ✅ Message clair
- ✅ Affichage de l'email connecté
- ✅ Bouton de déconnexion
- ✅ Bouton retour à l'accueil

---

## 🧪 Tester l'authentification

### Scénario 1 : Connexion réussie (Admin autorisé)

1. Accédez à http://localhost:9002/admin
2. Vous êtes redirigé vers `/admin/login`
3. Connectez-vous avec l'email/mdp créé dans Firebase
4. ✅ Si votre UID est dans `ADMIN_UIDS` → Dashboard admin affiché
5. ❌ Si votre UID n'est PAS dans `ADMIN_UIDS` → Écran "Accès refusé"

### Scénario 2 : Accès direct au dashboard

1. Essayez d'accéder directement à http://localhost:9002/admin
2. Si non connecté → Redirection automatique vers `/admin/login`
3. Si connecté mais pas admin → Écran "Accès refusé"
4. Si connecté ET admin → Dashboard affiché

### Scénario 3 : Déconnexion

1. Sur le dashboard, cliquez sur "Se déconnecter"
2. Vous êtes déconnecté et redirigé vers `/admin/login`
3. Impossible d'accéder à `/admin` sans vous reconnecter

---

## 📋 Prochaines étapes

### Phase 2 : Gestion du portfolio

- [ ] Créer `/admin/portfolio/page.tsx`
- [ ] Formulaire d'ajout de projet
- [ ] Formulaire d'édition de projet
- [ ] Suppression de projet (avec confirmation)
- [ ] Upload d'images vers Firebase Storage
- [ ] Connexion avec Firestore

### Améliorations futures

- [ ] Middleware Next.js côté serveur (en plus du client)
- [ ] Logs d'accès admin dans Firestore
- [ ] Authentification à deux facteurs (2FA)
- [ ] Gestion des rôles (super-admin, editor, viewer)
- [ ] Session timeout automatique
- [ ] Email de notification de connexion admin

---

## 🐛 Troubleshooting

### Erreur : "Network request failed"

**Cause** : Firebase n'est pas configuré ou les credentials sont incorrectes.

**Solution** :
1. Vérifiez que `.env.local` contient les bonnes valeurs
2. Vérifiez que vous avez créé un projet Firebase
3. Redémarrez le serveur (`npm run dev`)

### Erreur : "Accès refusé" malgré connexion

**Cause** : Votre UID n'est pas dans `ADMIN_UIDS`.

**Solution** :
1. Connectez-vous pour voir votre email dans l'écran "Accès refusé"
2. Allez dans Firebase Console > Authentication > Users
3. Trouvez votre email et copiez l'UID
4. Ajoutez cet UID dans [src/lib/admin.ts](src/lib/admin.ts:10)
5. Rafraîchissez la page

### Erreur : "auth is undefined"

**Cause** : Firebase Auth n'est pas initialisé correctement.

**Solution** :
1. Vérifiez que [src/lib/firebase/config.ts](src/lib/firebase/config.ts) exporte bien `auth`
2. Vérifiez que les env vars sont chargées
3. Redémarrez le serveur

---

## 📝 Récapitulatif des commandes

```bash
# Installation des dépendances (si pas déjà fait)
npm install

# Lancer le serveur de développement
npm run dev

# Build production
npm run build

# Lancer en production
npm run start
```

---

## ✅ Checklist de mise en production

Avant de déployer en production :

- [ ] Remplacer `<TODO_UID>` par votre vrai UID dans `ADMIN_UIDS`
- [ ] Configurer les vraies credentials Firebase dans `.env.local`
- [ ] Activer Authentication (Email/Password) dans Firebase Console
- [ ] Créer un compte admin dans Firebase Authentication
- [ ] Tester la connexion en local
- [ ] Tester le scénario "Accès refusé"
- [ ] Tester la déconnexion
- [ ] Ajouter les env vars dans Vercel (si déploiement Vercel)
- [ ] Configurer les règles de sécurité Firestore (si utilisé)
- [ ] Tester en production après déploiement

---

**Félicitations ! L'espace admin est maintenant opérationnel.** 🎉

Pour toute question, référez-vous au guide de développement [claude.md](claude.md).
