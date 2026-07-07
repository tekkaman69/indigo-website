# 🚨 FIX RAPIDE - Services invisibles

## Problème
Vous avez créé un service mais il n'apparaît pas sur `/services` avec ces erreurs:
- `Missing or insufficient permissions`
- `The query requires an index`

## Solution (5 minutes) ⏱️

### Étape 1: Déployer les règles (2 min)

1. Ouvrir https://console.firebase.google.com
2. Projet: **indigo-website-dde24**
3. Menu → **Firestore Database** → Onglet **Règles**
4. **Remplacer tout** par le contenu de `firestore.rules`
5. Cliquer **Publier**
6. ✅ Attendre confirmation

### Étape 2: Créer l'index (2 min)

**L'erreur vous donne le lien direct!**

Cliquez sur le lien dans l'erreur de la console:
```
https://console.firebase.google.com/v1/r/project/indigo-website-dde24/firestore/indexes?create_composite=...
```

→ Cliquer **Créer l'index**
→ Attendre 1-2 minutes (barre de progression)
→ ✅ Index créé!

### Étape 3: Rafraîchir (10 sec)

1. Retourner sur `/services`
2. Faire **Ctrl + Shift + R** (hard refresh)
3. ✅ Les services apparaissent!

---

## Vérification rapide

✅ **Console Firebase → Firestore Database → Règles**
   - Devrait contenir les règles pour `services`, `orders`, etc.

✅ **Console Firebase → Firestore Database → Index**
   - Devrait montrer: `services` avec champs `active` + `createdAt`
   - État: **Créé** (vert)

✅ **Page `/services`**
   - Pas d'erreur dans la console
   - Services affichés

✅ **Admin `/admin/services`**
   - Peut créer un nouveau service
   - Sauvegarde sans erreur

---

## Alternative: Firebase CLI

Si vous préférez la ligne de commande:

```bash
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Login
firebase login

# Déployer règles + index
firebase deploy --only firestore
```

Attendre quelques secondes, puis rafraîchir la page.

---

## Si ça ne marche toujours pas

### Cache navigateur
```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

### Vérifier les règles sont bien déployées
1. Console Firebase → Firestore Database → Règles
2. Vérifier que vous voyez `match /services/{serviceId}`
3. Si non → Re-publier

### Vérifier l'index est créé
1. Console Firebase → Firestore Database → Index
2. Chercher `services`
3. État doit être **Créé** (pas "En cours")
4. Si "En cours" → Attendre 2-3 minutes

### Logs Firebase
Console navigateur (F12) → Onglet **Console**
- Noter les erreurs exactes
- Vérifier que `auth` est bien initialisé

---

## Pourquoi ces étapes sont nécessaires?

### Règles Firestore
Le fichier `firestore.rules` est **local**. Firebase ne le lit pas automatiquement.
Il faut le **déployer** via Console ou CLI pour qu'il soit appliqué.

### Index Firestore
Firestore nécessite des **index** pour les requêtes complexes:
- Requêtes avec plusieurs `where()`
- Requêtes avec `orderBy()` + filtres
- Requêtes avec tri sur champs multiples

L'index `services` (active + createdAt) permet:
```typescript
query(servicesRef,
  where('active', '==', true),
  orderBy('createdAt', 'desc')
)
```

Sans index → Erreur `requires an index`
Avec index → ✅ Requête ultra-rapide

---

## Après le fix

Une fois les règles et index déployés:

✅ **Tout fonctionne**
- Créer services
- Voir services sur `/services`
- Créer commandes
- Voir commandes admin

✅ **Plus besoin de redéployer**
- Les règles restent actives
- Les index sont permanents
- Modifier `firestore.rules` local ne casse rien (pas auto-déployé)

⚠️ **Sécurité**
Les règles actuelles sont **ouvertes** (développement).
Avant production → Sécuriser avec UID admin (voir `DEPLOYER_REGLES_FIRESTORE.md`)

---

## Résumé ultra-rapide

```
1. Firebase Console → Firestore → Règles → Copier firestore.rules → Publier
2. Cliquer lien index dans erreur → Créer l'index
3. Rafraîchir /services
4. ✅ DONE
```

**Temps total: 5 minutes max** 🚀
