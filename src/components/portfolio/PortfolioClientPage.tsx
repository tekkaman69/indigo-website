'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PortfolioItem, PortfolioCategory } from '@/lib/types';
import PortfolioFilter from './PortfolioFilter';
import PortfolioGrid from './PortfolioGrid';
import { PORTFOLIO_CATEGORIES } from '@/config/portfolio-taxonomy';

type PortfolioClientPageProps = {
  items: PortfolioItem[];
};

const allCategories = [...PORTFOLIO_CATEGORIES] as PortfolioCategory[];

function PortfolioClientContent({ items }: PortfolioClientPageProps) {
  const searchParams = useSearchParams();
  const filterCategory = searchParams.get('filter') as PortfolioCategory | null;

  const [activeCategory, setActiveCategory] = useState<PortfolioCategory | 'Tous'>(filterCategory || 'Tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (filterCategory && allCategories.includes(filterCategory)) {
      setActiveCategory(filterCategory);
    }
  }, [filterCategory]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCategory === 'Tous' || item.categories.includes(activeCategory);
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, searchTerm]);

  return (
    <div>
      <PortfolioFilter
        categories={['Tous', ...allCategories]}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <PortfolioGrid items={filteredItems} />
    </div>
  );
}

export default function PortfolioClientPage({ items }: PortfolioClientPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioClientContent items={items} />
    </Suspense>
  );
}
