# 🔐 Guide Rapide - Espace Admin

## 📦 Fichiers créés

### Configuration & Logique
- ✅ [src/lib/admin.ts](src/lib/admin.ts) - Liste des UIDs admin autorisés
- ✅ [src/components/admin/AdminGuard.tsx](src/components/admin/AdminGuard.tsx) - Composant de protection

### Pages
- ✅ [src/app/admin/login/page.tsx](src/app/admin/login/page.tsx) - Connexion admin
- ✅ [src/app/admin/page.tsx](src/app/admin/page.tsx) - Dashboard admin

### Documentation
- ✅ [ADMIN_SETUP.md](ADMIN_SETUP.md) - Documentation complète

---

## ⚡ Configuration en 3 étapes

### 1️⃣ Configurez Firebase

Créez un projet sur https://console.firebase.google.com et activez Authentication (Email/Password).

### 2️⃣ Ajoutez vos credentials

Dans [.env.local](.env.local), remplacez par vos vraies valeurs :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_vraie_clé
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_projet.firebaseapp.com
# ... etc
```

### 3️⃣ Ajoutez votre UID admin

Dans [src/lib/admin.ts](src/lib/admin.ts:10), remplacez `<TODO_UID>` :

```typescript
export const ADMIN_UIDS: string[] = [
  "votre-uid-firebase-ici", // ⚠️ À REMPLACER
];
```

**Comment obtenir votre UID ?**
1. Créez un compte dans Firebase Console > Authentication
2. Copiez l'UID affiché
3. Collez-le dans `ADMIN_UIDS`

---

## 🚀 Lancer le site

```bash
npm run dev
```

Accédez à http://localhost:9002/admin

---

## 🧪 Tester

1. **Connexion** : http://localhost:9002/admin/login
2. **Dashboard** : http://localhost:9002/admin (protégé)

### Scénarios

| Situation | Résultat |
|-----------|----------|
| Pas connecté + accès `/admin` | Redirect vers `/admin/login` |
| Connecté mais UID pas dans liste | Écran "Accès refusé" |
| Connecté ET UID dans liste | Dashboard admin affiché |

---

## 📚 Documentation complète

Consultez [ADMIN_SETUP.md](ADMIN_SETUP.md) pour :
- Architecture détaillée
- Troubleshooting
- Prochaines étapes
- Checklist production

---

**Statut** : ✅ Fonctionnel (nécessite configuration Firebase)
