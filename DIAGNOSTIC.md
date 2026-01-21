# Diagnostic Images - Indigo Studio

## Test à effectuer MAINTENANT

### 1. Ouvrir Console Browser (F12)
- Aller sur: http://localhost:3000/admin/portfolio/editor?id=HdTbIDdp7j4sNVEkoD9e
- Ouvrir l'onglet Console

### 2. Upload une image
- Ajouter une section
- Ajouter un bloc Image
- Uploader une image

### 3. Noter EXACTEMENT les logs suivants:

```
[UPLOAD] Starting upload: {...}
[STORAGE] Uploading to path: ...
[STORAGE] Upload complete: ...
[STORAGE] Download URL: https://firebasestorage.googleapis.com/...
[BLOCK_UPDATE] Updating block src: ...
[EDITOR_STATE] Updating block: {...}
[EDITOR_STATE] New block state: {...}
```

### 4. Questions critiques:

**Q1: L'URL obtenue commence-t-elle par:**
- [ ] https://firebasestorage.googleapis.com/ ✅ CORRECT
- [ ] gs:// ❌ ERREUR - c'est un path, pas une URL

**Q2: Après upload, voyez-vous:**
- [ ] Un carré vide avec "No image selected" ❌
- [ ] Un carré gris avec fond ✅
- [ ] L'image s'affiche ✅✅

**Q3: Dans Network tab (F12 > Network):**
- Filtrer par "Img"
- L'URL de votre image apparaît-elle?
- [ ] Oui, status 200 ✅
- [ ] Oui, status 403 ❌ Problème Firebase Rules
- [ ] Non, pas de requête ❌ L'URL n'est pas dans le DOM

### 5. Vérifier Firestore

Aller sur Firebase Console > Firestore > portfolio > [votre projet]

Copier EXACTEMENT la structure que vous voyez pour sections[0].blocks[0]:
```
src: "..." <- COLLER L'URL ICI
type: "image"
id: "..."
```

---

## Instructions à me donner

Collez ici les résultats:

1. Les logs console (au moins [STORAGE] Download URL)
2. Réponses aux questions Q1, Q2, Q3
3. La structure Firestore réelle (juste le bloc image)

Avec ça, je saurai exactement où corriger.
