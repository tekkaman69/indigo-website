// Configuration centralisée pour les catégories et tags du portfolio

export const PORTFOLIO_CATEGORIES = [
  'Automatisation',
  'Vidéo',
  'Réseaux sociaux',
  'Graphisme',
  'Identité / Branding',
  'Ads',
] as const;

export const PORTFOLIO_TAGS = [
  // Services Vidéo
  'Motion Design',
  'Montage Vidéo',
  'Animation',
  'Post-production',
  'Color Grading',

  // Réseaux Sociaux & Plateformes
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
  'LinkedIn',
  'Twitter',

  // Formats de Contenu
  'Reel',
  'Short',
  'Story',
  'Post',
  'Carrousel',
  'Vidéo Longue',
  'Podcast',

  // Publicité & Marketing
  'Publicité',
  'Campagne Pub',
  'Ads Facebook',
  'Ads Instagram',
  'Ads Google',
  'Ads TikTok',
  'Performance Marketing',

  // Design & Création
  'Logo',
  'Charte Graphique',
  'Identité Visuelle',
  'Branding',
  'Print',
  'Packaging',
  'Web Design',
  'UI/UX',
  'Illustration',
  'Affiche',
  'Flyer',

  // Stratégie & Contenu
  'Stratégie Digitale',
  'Content Strategy',
  'Community Management',
  'Storytelling',
  'Copywriting',
  'Content Creation',

  // Automatisation & Tech
  'Automatisation',
  'Workflow',
  'Integration',
  'CRM',
  'Email Marketing',

  // Secteurs d'Activité
  'E-commerce',
  'Sport',
  'Fitness',
  'Nutrition',
  'Tech',
  'SaaS',
  'Food & Beverage',
  'Restaurant',
  'Mode',
  'Beauté',
  'Santé',
  'Immobilier',
  'Finance',
  'Education',
  'Tourisme',
  'Événementiel',
] as const;

// Groupes de tags pour une meilleure organisation dans l'UI
export const PORTFOLIO_TAG_GROUPS = {
  'Services Vidéo': [
    'Motion Design',
    'Montage Vidéo',
    'Animation',
    'Post-production',
    'Color Grading',
  ],
  'Réseaux Sociaux': [
    'Instagram',
    'TikTok',
    'YouTube',
    'Facebook',
    'LinkedIn',
    'Twitter',
  ],
  'Formats': [
    'Reel',
    'Short',
    'Story',
    'Post',
    'Carrousel',
    'Vidéo Longue',
    'Podcast',
  ],
  'Publicité': [
    'Publicité',
    'Campagne Pub',
    'Ads Facebook',
    'Ads Instagram',
    'Ads Google',
    'Ads TikTok',
    'Performance Marketing',
  ],
  'Design': [
    'Logo',
    'Charte Graphique',
    'Identité Visuelle',
    'Branding',
    'Print',
    'Packaging',
    'Web Design',
    'UI/UX',
    'Illustration',
    'Affiche',
    'Flyer',
  ],
  'Stratégie': [
    'Stratégie Digitale',
    'Content Strategy',
    'Community Management',
    'Storytelling',
    'Copywriting',
    'Content Creation',
  ],
  'Tech': [
    'Automatisation',
    'Workflow',
    'Integration',
    'CRM',
    'Email Marketing',
  ],
  'Secteurs': [
    'E-commerce',
    'Sport',
    'Fitness',
    'Nutrition',
    'Tech',
    'SaaS',
    'Food & Beverage',
    'Restaurant',
    'Mode',
    'Beauté',
    'Santé',
    'Immobilier',
    'Finance',
    'Education',
    'Tourisme',
    'Événementiel',
  ],
} as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];
export type PortfolioTag = typeof PORTFOLIO_TAGS[number];
