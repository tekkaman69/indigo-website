import { Search, PenTool, Bot, Rocket, LucideIcon } from 'lucide-react';

export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    icon: Search,
    title: '1. Découverte',
    description: 'Nous plongeons dans votre univers pour comprendre vos objectifs, votre audience et vos défis uniques.',
  },
  {
    icon: PenTool,
    title: '2. Direction Artistique',
    description: 'Nous créons une stratégie créative et une identité visuelle qui résonnent avec votre marque.',
  },
  {
    icon: Bot,
    title: '3. Production',
    description: 'Nos experts donnent vie aux concepts, que ce soit en code, en design ou en contenu vidéo.',
  },
  {
    icon: Rocket,
    title: '4. Livraison & Itération',
    description: 'Nous livrons le projet final et restons à vos côtés pour analyser, optimiser et évoluer.',
  },
];
