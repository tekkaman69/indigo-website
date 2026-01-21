export interface Testimonial {
  name: string;
  company: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah L.',
    company: 'CEO, TechNova',
    quote: 'L\'équipe d\'Indigo a complètement transformé notre présence en ligne. Leur expertise en automatisation nous a fait gagner un temps précieux.',
  },
  {
    name: 'Julien M.',
    company: 'Fondateur, Éco-Logis',
    quote: 'La campagne vidéo UGC a été un succès retentissant. Authentique, percutante et parfaitement alignée avec nos valeurs.',
  },
  {
    name: 'Chloé D.',
    company: 'Artiste Indépendante',
    quote: 'Mon nouveau branding est juste incroyable. Ils ont su capturer l\'essence de mon art et le traduire en une identité visuelle forte.',
  },
];
