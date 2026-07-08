'use client';

import type { PortfolioItem } from '@/types/firebase';
import { BUSINESS_CATEGORIES, type BusinessCategory } from '@/config/business-categories';

interface HomeProjectMetaFieldsProps {
  title: string;
  businessCategory?: BusinessCategory;
  linkedPortfolioId?: string;
  published: boolean;
  portfolioItems: PortfolioItem[];
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onLinkedPortfolioChange: (id: string) => void;
  onPublishedChange: (published: boolean) => void;
  disabled?: boolean;
}

/** Champs méta du projet home : titre, catégorie, lien portfolio optionnel, publication. */
export default function HomeProjectMetaFields({
  title, businessCategory, linkedPortfolioId, published, portfolioItems,
  onTitleChange, onCategoryChange, onLinkedPortfolioChange, onPublishedChange, disabled,
}: HomeProjectMetaFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="home-project-title" className="text-sm font-medium text-white/80">Titre</label>
        <input
          id="home-project-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          placeholder="Nom du projet"
          className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/80">Catégorie (filtre de la home)</label>
        <select
          value={businessCategory ?? ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={disabled}
          className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" className="bg-gray-900 text-white">Aucune</option>
          {BUSINESS_CATEGORIES.map(cat => (
            <option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-white/80">Projet portfolio lié (optionnel)</label>
        <select
          value={linkedPortfolioId ?? ''}
          onChange={(e) => onLinkedPortfolioChange(e.target.value)}
          disabled={disabled}
          className="w-full h-10 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="" className="bg-gray-900 text-white">Aucun (pas de lien)</option>
          {portfolioItems.map(p => (
            <option key={p.id} value={p.id} className="bg-gray-900 text-white">{p.title}</option>
          ))}
        </select>
        <p className="text-xs text-white/30">
          Si défini, cliquer sur la carte sur la home renvoie vers ce projet portfolio.
        </p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => onPublishedChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm text-white/80">Publié (visible sur la home)</span>
      </label>
    </>
  );
}
