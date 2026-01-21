import {
  Cpu,
  Clapperboard,
  Share2,
  Brush,
  Bot,
  UserCheck,
  MessageSquareReply,
  Newspaper,
  Phone,
  Video,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  Palette,
  UserCircle,
  Contact,
  Presentation,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  icon: LucideIcon;
  text: string;
}

export interface Service {
  value: string;
  title: string;
  icon: LucideIcon;
  description: string;
  items: ServiceItem[];
}

export const services: Service[] = [
  {
    value: 'automations',
    title: 'Automatisations',
    icon: Cpu,
    description: 'Optimisez votre temps et vos process avec nos solutions IA sur-mesure.',
    items: [
      { icon: Bot, text: 'Assistant IA personnalisé' },
      { icon: UserCheck, text: 'Acquisition de leads qualifiés' },
      { icon: MessageSquareReply, text: 'Réponses automatiques (réseaux, avis)' },
      { icon: Newspaper, text: 'Création de contenu automatisée' },
      { icon: Phone, text: 'Assistant téléphonique IA (prospection, closing, RDV)' },
    ],
  },
  {
    value: 'video',
    title: 'Créations vidéo',
    icon: Clapperboard,
    description: 'Des formats vidéo percutants pour capter l\'attention de votre audience.',
    items: [
      { icon: Video, text: 'Publicités vidéo générées par IA' },
      { icon: Users, text: 'Vidéos UGC (User Generated Content)' },
    ],
  },
  {
    value: 'social',
    title: 'Contenu réseaux sociaux',
    icon: Share2,
    description: 'Une présence sociale cohérente et engageante pour bâtir votre communauté.',
    items: [
      { icon: Instagram, text: 'Posts & stories Instagram' },
      { icon: Facebook, text: 'Posts & campagnes Facebook' },
      { icon: Linkedin, text: 'Stratégie & posts LinkedIn' },
    ],
  },
  {
    value: 'graphics',
    title: 'Créations graphiques',
    icon: Brush,
    description: 'Un design premium pour une marque qui se démarque.',
    items: [
      { icon: Palette, text: 'Chartes graphiques complètes' },
      { icon: UserCircle, text: 'Avatar / mascotte de marque' },
      { icon: Contact, text: 'Cartes de visite et papeterie' },
      { icon: Presentation, text: 'Flyers et supports publicitaires' },
    ],
  },
];
