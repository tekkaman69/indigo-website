'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';
import type { PortfolioItem } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            layout
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/portfolio/${item.id}`}>
              <Card className="group relative overflow-hidden rounded-xl border-white/10 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 h-full">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={item.coverImage?.url || ''}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      style={{ objectPosition: item.coverPosition || 'center' }}
                      data-ai-hint={item.coverImage?.hint}
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg flex-grow">{item.title}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
