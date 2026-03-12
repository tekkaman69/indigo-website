export interface Testimonial {
  name: string;
  role?: string;
  company: string;
  quote: string;
  rating?: number;
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Emmanuel D.',
    role: 'CEO',
    company: 'Suteki',
    quote: 'Indigo a livré bien au-delà de nos attentes. La plateforme en ligne est fluide, moderne et parfaitement représentative de notre univers. La direction artistique couvre tous nos projets avec une cohérence impressionnante — chaque visuel raconte notre histoire. Un partenaire de confiance que je recommande sans hésiter.',
    rating: 5,
    featured: true,
  },
  {
    name: 'Cassandra T.',
    role: 'CEO',
    company: 'Paideia',
    quote: 'Travailler avec Indigo pour notre plateforme éducative a été une expérience remarquable. Ils ont saisi dès le départ l\'ambition pédagogique de Paideia et l\'ont traduite en une interface claire, engageante et à l\'identité visuelle forte. Résultat : nos apprenants s\'y retrouvent immédiatement et nos partenaires institutionnels prennent confiance dès le premier regard.',
    rating: 5,
    featured: true,
  },
  {
    name: 'Claude C.',
    role: 'Gérante & Propriétaire',
    company: 'Chez Claudie',
    quote: 'Mon site de présentation et de réservation pour l\'hébergement a tout changé. Les clients peuvent désormais découvrir l\'établissement en quelques secondes et réserver directement en ligne. Indigo a su capturer l\'âme chaleureuse de "Chez Claudie" — simple, élégant, efficace. Je reçois des compliments sur le site aussi souvent que sur les chambres !',
    rating: 5,
    featured: true,
  },
];
