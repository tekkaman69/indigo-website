# Documentation des modifications - Formulaires & Réglages

## Mission accomplie

### PART 1: Audit et correction des formulaires
### PART 2: Toggle admin pour la page Services

---

## PART 1: Formulaires de contact

### Audit effectué

| Formulaire | Emplacement | État initial | État final |
|------------|-------------|--------------|------------|
| ContactForm | `/contact` page | Fonctionnel | Fonctionnel |
| ContactCta | Homepage (bas) | **CASSÉ** - Pas de submit handler | **CORRIGÉ** |
| Checkout Services | `/services/cart` | Fonctionnel | Fonctionnel |

### Correction ContactCta.tsx

**Problème**: Le formulaire était du HTML statique sans aucune logique de soumission.

**Solution**: Ajout complet de la logique React:
- État `formData` avec useState
- État `isSubmitting` pour loading
- Validation côté client (email, longueur message)
- Appel à `/api/contact`
- Toast de succès/erreur
- Reset du formulaire après succès

**Fichier**: [src/components/home/ContactCta.tsx](src/components/home/ContactCta.tsx)

### Amélioration de la livraison d'emails

**Fichier**: [src/app/api/contact/route.ts](src/app/api/contact/route.ts)

L'API utilise maintenant une stratégie double:
1. **Resend API** (recommandé) - Gratuit, fonctionne sur Vercel
2. **SMTP/Nodemailer** (fallback) - Alternative si Resend non configuré

### Comment changer l'email destinataire

**Option 1**: Variable d'environnement (recommandé)
```bash
# Dans .env.local
CONTACT_EMAIL=votre-email@exemple.com
```

**Option 2**: Directement dans le code
```typescript
// src/app/api/contact/route.ts, ligne 9
const RECIPIENT_EMAIL = 'votre-email@exemple.com';
```

### Configuration Resend (recommandé pour Vercel)

1. Créer un compte gratuit sur https://resend.com
2. Ajouter dans `.env.local`:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=Indigo Contact <onboarding@resend.dev>
```

---

## PART 2: Toggle page Services

### Fonctionnalité

Les administrateurs peuvent activer/désactiver la visibilité de la page Services pour les visiteurs publics.

- **Désactivé**: Les visiteurs voient une page "Bientôt disponible"
- **Activé**: Les visiteurs peuvent accéder au marketplace
- **Admins**: Toujours accès, avec bandeau d'avertissement si page désactivée

### Fichiers créés/modifiés

| Fichier | Action | Description |
|---------|--------|-------------|
| `src/lib/firebase/firestore.ts` | Modifié | Ajout `SiteSettings` interface et fonctions |
| `src/app/admin/settings/page.tsx` | **Créé** | Page réglages admin |
| `src/app/services/page.tsx` | Modifié | Vérification visibilité + page "Coming Soon" |
| `src/components/layout/Header.tsx` | Modifié | Lien "Réglages" dans dropdown admin |
| `firestore.rules` | Modifié | Collection `site_settings` |

### Interface SiteSettings

```typescript
// src/lib/firebase/firestore.ts
interface SiteSettings {
  servicesPageEnabled: boolean;
  updatedAt?: Date;
}
```

### Accès au toggle

1. Se connecter en tant qu'admin
2. Menu "Portail Admin" → "Réglages"
3. Ou directement: `/admin/settings`

### Collection Firestore

```
site_settings/
  └── main
      ├── servicesPageEnabled: boolean
      └── updatedAt: Timestamp
```

---

## Déploiement Firestore Rules

**IMPORTANT**: Déployer les règles Firestore pour que `site_settings` fonctionne.

### Via Console Firebase
1. Aller sur https://console.firebase.google.com
2. Sélectionner projet → Firestore → Rules
3. Copier le contenu de `firestore.rules`
4. Publier

### Via CLI
```bash
firebase deploy --only firestore:rules
```

---

## Structure finale

```
src/
├── app/
│   ├── admin/
│   │   └── settings/
│   │       └── page.tsx        # Page réglages (NOUVEAU)
│   ├── api/
│   │   └── contact/
│   │       └── route.ts        # API avec Resend (MODIFIÉ)
│   └── services/
│       └── page.tsx            # Avec toggle visibilité (MODIFIÉ)
├── components/
│   ├── home/
│   │   └── ContactCta.tsx      # Formulaire corrigé (MODIFIÉ)
│   └── layout/
│       └── Header.tsx          # Lien Réglages (MODIFIÉ)
└── lib/
    └── firebase/
        └── firestore.ts        # SiteSettings (MODIFIÉ)

firestore.rules                 # Collection site_settings (MODIFIÉ)
.env.local.example             # Variables Resend (MODIFIÉ)
```

---

## Résumé des actions

### Fait ✅
- [x] Audit de tous les formulaires
- [x] Correction ContactCta (form cassé)
- [x] Ajout Resend API pour emails
- [x] Interface SiteSettings Firestore
- [x] Page /admin/settings avec toggle
- [x] Logique visibilité dans /services
- [x] Lien "Réglages" dans Header admin
- [x] Règles Firestore pour site_settings
- [x] Documentation

### À faire par l'utilisateur
- [ ] Configurer RESEND_API_KEY dans .env.local (optionnel mais recommandé)
- [ ] Déployer firestore.rules sur Firebase Console
- [ ] Tester le toggle sur /admin/settings

---

## Test rapide

1. **Tester ContactCta**:
   - Aller sur la homepage
   - Remplir le mini-formulaire en bas
   - Vérifier toast de succès
   - Vérifier email reçu (si Resend configuré)

2. **Tester toggle Services**:
   - Aller sur /admin/settings
   - Désactiver la page Services
   - Ouvrir /services en navigation privée
   - Vérifier page "Bientôt disponible"
   - Réactiver et vérifier accès normal
