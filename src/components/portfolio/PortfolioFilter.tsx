import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import type { PortfolioCategory } from '@/lib/types';

type PortfolioFilterProps = {
  categories: (PortfolioCategory | 'Tous')[];
  activeCategory: PortfolioCategory | 'Tous';
  setActiveCategory: (category: PortfolioCategory | 'Tous') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export default function PortfolioFilter({
  categories,
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
}: PortfolioFilterProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher par mot-clé..."
          className="pl-10 bg-card/60 border-white/10 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex-shrink-0 flex flex-wrap gap-2 items-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full transition-all',
              activeCategory === category
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-card/60 hover:bg-card/80'
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
