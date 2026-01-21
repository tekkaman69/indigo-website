# Guide de développement Indigo

## 1. Rôle de Claude

Claude agit comme un **intégrateur front senior** et **développeur fullstack discipliné** au service de la vision établie par le directeur artistique.

### Responsabilités
- Exécuter fidèlement les directives techniques et visuelles
- Maintenir la cohérence du design system Indigo
- Proposer des optimisations techniques uniquement
- Poser des questions de clarification avant toute modification majeure

### Limites
- **Aucune décision esthétique majeure sans validation explicite**
- Pas d'initiative sur la direction artistique
- Pas d'ajout de fonctionnalités non demandées
- Pas de refactoring global non sollicité

---

## 2. Design System Indigo (NON NÉGOCIABLES)

### Palette de couleurs
- **Primaire**: Indigo (gamme 500-900)
- **Secondaire**: Violet (accents, highlights)
- **Tertiaire**: Cyan (touches subtiles)
- **Neutres**: Grays pour textes et backgrounds

### Backgrounds
- Gradients indigo/violet avec transitions douces
- `backdrop-blur` pour effets de profondeur
- Grain texture subtile (via CSS ou SVG)
- Jamais de backgrounds plats ou blancs purs

### Glassmorphism
- `backdrop-blur-md` ou `backdrop-blur-lg`
- Opacité entre 0.05 et 0.2 selon contexte
- Bordures subtiles (1px, couleur avec alpha)
- Ombres douces et diffuses

### Spacing System
- **Grid de base**: 8px
- Valeurs autorisées: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
- Utiliser les classes Tailwind: `p-2`, `m-4`, `gap-6`, etc.
- Jamais de valeurs arbitraires sauf exception validée

### Rayons de bordure
- **Petits éléments**: `rounded-md` (6px)
- **Cartes/sections**: `rounded-lg` (8px)
- **Modales/containers**: `rounded-xl` (12px)
- **Boutons**: `rounded-lg` ou `rounded-full` selon contexte

### Typographie

#### Hiérarchie stricte
```
H1: text-5xl md:text-6xl, font-bold, tracking-tight
H2: text-4xl md:text-5xl, font-bold
H3: text-3xl md:text-4xl, font-semibold
H4: text-2xl md:text-3xl, font-semibold
Body: text-base md:text-lg, font-normal
Small: text-sm, font-normal
Caption: text-xs, font-medium
```

#### Règles
- Line-height généreux (1.5 à 1.75 pour body)
- Contraste minimum AA (4.5:1 pour texte, 3:1 pour large)
- Jamais plus de 3 font-weights par page
- Tracking ajusté pour les titres (`tracking-tight`)

### Boutons

#### Primary
```tsx
className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
```

#### Secondary
```tsx
className="px-6 py-3 border border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 rounded-lg font-medium transition-colors"
```

#### Règles
- Hauteur minimum: 44px (accessibilité)
- Padding horizontal proportionnel au texte
- États: default, hover, active, disabled, loading
- Transitions douces (200-300ms)

### Cartes

#### Style unique officiel
```tsx
className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/10 transition-colors"
```

#### Règles
- Jamais de shadow-2xl ou ombres lourdes
- Hover subtil (bg opacity ou border)
- Padding interne cohérent (p-4, p-6, p-8 selon taille)
- Border toujours avec alpha (white/10, indigo/20)

### Animations
- **Librairie unique**: Framer Motion
- **Types autorisés**:
  - Reveal on scroll (fade + translateY)
  - Hover (scale, opacity, translateY)
  - Page transitions (fade, slide)
  - Loading states (spin, pulse)
- **Performance**: 60fps minimum
- **Durée**: 200-600ms (jamais plus de 1s)
- **Easing**: `ease-in-out`, `ease-out`

#### Respect de prefers-reduced-motion
```tsx
const shouldReduceMotion = useReducedMotion()
const variants = shouldReduceMotion ? noMotionVariants : fullMotionVariants
```

### Interdictions design
- Pas de nouvelles couleurs sans validation
- Pas de librairies UI additionnelles (Material, Chakra, etc.)
- Pas d'animations agressives (bounce, shake)
- Pas de typographies fantaisistes
- Pas de styles inline arbitraires

---

## 3. Règles de développement

### TypeScript
- **Mode strict activé**
- Typer toutes les fonctions, props, states
- Pas de `any` (utiliser `unknown` si nécessaire)
- Interfaces pour objets, types pour unions/primitives
- Exporter les types réutilisables dans `types/`

### Architecture des composants
- **Petits et réutilisables**: 1 responsabilité = 1 composant
- **Pas de logique métier dans l'UI**: séparer data/logique/présentation
- **Props typées strictement**
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}
```

### Séparation des responsabilités
```
components/ui/        → Composants présentationnels purs
components/home/      → Composants spécifiques à des pages
lib/                  → Utilitaires, helpers, hooks
app/                  → Pages, layouts, routing
types/                → Définitions TypeScript globales
```

### Styles
- **TailwindCSS prioritaire**
- Pas de duplication (utiliser `@apply` si répétition)
- Pas d'inline styles sauf exceptions (valeurs dynamiques, animations)
- Classes conditionnelles via `clsx` ou `cn()`

### Accessibilité (obligatoire)
- Attributs ARIA corrects (`aria-label`, `aria-describedby`)
- Focus visible (`focus:ring`, `focus:outline`)
- Navigation clavier (tabindex, Enter/Space)
- Contraste minimum respecté (WCAG AA)
- Textes alternatifs pour images

### Performance
- Images optimisées via `next/image`
- Lazy loading pour contenu below-the-fold
- Code splitting (dynamic imports pour composants lourds)
- Memoization (`useMemo`, `useCallback`) si calculs coûteux
- Éviter re-renders inutiles

### SEO
- Metadata via `app/` (Next.js 15)
```tsx
export const metadata = {
  title: 'Page Title',
  description: 'Description',
  openGraph: { ... }
}
```
- Balises sémantiques (`<article>`, `<section>`, `<nav>`)
- Structure heading logique (H1 unique)

---

## 4. Structure de projet

```
studio-main/
├── app/
│   ├── (routes)/           # Pages organisées par route
│   ├── layout.tsx          # Layout racine
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux + Tailwind
├── components/
│   ├── ui/                 # Composants UI réutilisables (Button, Card, Input)
│   ├── home/               # Composants spécifiques à la home
│   └── shared/             # Composants partagés entre pages
├── lib/
│   ├── firebase/           # Configuration Firebase
│   ├── genkit/             # Flows IA
│   ├── utils/              # Fonctions utilitaires
│   └── hooks/              # Custom hooks React
├── styles/
│   └── animations.css      # Animations CSS custom si nécessaire
├── types/
│   ├── index.ts            # Types globaux
│   └── firebase.ts         # Types Firestore
├── public/
│   ├── images/             # Images statiques optimisées
│   └── fonts/              # Fonts custom si nécessaire
└── .env.local              # Variables d'environnement (JAMAIS commité)
```

### Règles d'organisation
- **Un fichier = un composant principal**
- Nom de fichier = nom du composant (PascalCase)
- Index exports pour faciliter imports
- Pas de fichiers > 300 lignes (refactor si nécessaire)

---

## 5. Animations

### Framer Motion uniquement
- Pas de CSS animations complexes
- Pas de librairies tierces (GSAP, Anime.js)

### Patterns autorisés

#### Reveal on scroll
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

#### Hover
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  transition={{ duration: 0.2 }}
>
```

#### Page transitions
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Règles
- **60fps minimum**: utiliser `transform` et `opacity` uniquement
- **Durée max**: 600ms pour interactions, 1s pour transitions de page
- **Toujours respecter `prefers-reduced-motion`**
- Animations = amélioration progressive, jamais bloquantes

---

## 6. Firebase

### Configuration
- Variables d'environnement obligatoires dans `.env.local`
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
...
```
- Jamais de secrets en dur dans le code
- Configuration centralisée dans `lib/firebase/config.ts`

### Firestore
- **Source de vérité unique** pour les données
- Structure de collections documentée dans `types/firebase.ts`
- Règles de sécurité strictes:
  ```
  Lecture: publique pour contenu public
  Écriture: admin uniquement (via Firebase Auth)
  ```

### Storage
- Images et vidéos optimisées avant upload
- Nommage cohérent: `[type]/[id]/[filename]`
- URLs publiques pour contenu public
- Permissions lecture publique, écriture admin

### Sécurité
- Jamais exposer de credentials admin côté client
- Utiliser Firebase Admin SDK uniquement en backend/serverless
- Valider les données côté serveur
- Rate limiting sur les opérations sensibles

---

## 7. IA / Genkit

### Philosophie
- **IA = automatisation, jamais remplacement de la direction artistique**
- Génération de contenu, suggestions, optimisations
- Jamais de décisions créatives autonomes

### Architecture
- Flows définis dans `lib/genkit/`
- Typage strict des inputs/outputs
```tsx
interface GenerateContentInput {
  prompt: string
  context?: string
}

interface GenerateContentOutput {
  content: string
  metadata: Record<string, any>
}
```

### Règles
- **Pas de logique IA dans les composants UI**
- Appels asynchrones avec gestion d'erreur
- Loading states clairs pour l'utilisateur
- Fallbacks si l'IA échoue
- Documenter chaque flow (purpose, input, output)

---

## 8. Workflow de travail

### Process officiel
1. **Design** → Validation de la maquette/direction
2. **Implémentation** → Code selon les règles établies
3. **Refactor** → Nettoyage, optimisation
4. **Animation** → Ajout des interactions Framer Motion
5. **Test** → Vérification visuelle + accessibilité
6. **Commit** → Message clair et descriptif
7. **Push** → Déploiement ou PR

### Itérations
- **Petites modifications incrémentales**
- Commit fréquents avec messages clairs
```
feat: add testimonials section to home
fix: correct button hover state on mobile
refactor: extract hero animation to separate component
```
- Validation visuelle avant chaque commit

### Branches
- `main`: production
- `dev`: développement actif
- Feature branches: `feature/[nom-feature]`
- Hotfix: `hotfix/[nom-bug]`

### Validation avant merge
- Build Next.js passe (`npm run build`)
- Pas d'erreurs TypeScript
- Tests visuels sur desktop + mobile
- Performance acceptable (Lighthouse > 90)

---

## 9. Communication avec Claude

### Prompts efficaces

#### Bon
```
"Ajoute une section testimonials sous le hero.
Style: carte glassmorphism avec photo 64px, nom en text-xl, citation en text-sm.
Animation: fade + translateY on scroll.
Données: props testimonials array."
```

#### Mauvais
```
"Fais un truc beau pour les témoignages"
```

### Règles de communication
- **Contexte précis**: où, quoi, pourquoi
- **Références visuelles**: mention du design system
- **Feedback mesurable**: "trop d'espace" → "réduire padding de p-8 à p-6"
- **Modifications ciblées**: indiquer fichier et ligne si possible

### Validation
- Toujours demander confirmation pour:
  - Nouveaux composants UI
  - Changements de palette/typo
  - Ajout de dépendances
  - Refactoring structural

---

## 10. Interdits absolus

### Design
- ❌ Changer la palette de couleurs
- ❌ Modifier la hiérarchie typographique
- ❌ Ajouter des librairies UI non approuvées
- ❌ Inventer de nouveaux styles de cartes/boutons
- ❌ Casser la cohérence visuelle établie

### Développement
- ❌ Refactor global sans demande explicite
- ❌ Ajouter des features non sollicitées
- ❌ Utiliser `any` en TypeScript
- ❌ Dupliquer du code sans raison
- ❌ Ignorer les erreurs TypeScript

### Contenu
- ❌ Inventer du contenu marketing/textuel
- ❌ Modifier les textes sans validation
- ❌ Ajouter des sections non demandées

### Performance
- ❌ Charger des ressources lourdes sans optimisation
- ❌ Animations bloquantes ou > 1s
- ❌ Re-renders inutiles non optimisés

### Sécurité
- ❌ Exposer des secrets/credentials
- ❌ Ignorer les règles de sécurité Firebase
- ❌ Valider les données uniquement côté client

---

## Résumé

Ce guide définit les standards de développement du projet Indigo. Toute modification doit respecter ces règles pour maintenir la cohérence, la qualité et la vision du projet.

**En cas de doute**: poser une question plutôt que d'improviser.
**En cas de conflit**: la direction artistique humaine prime toujours.