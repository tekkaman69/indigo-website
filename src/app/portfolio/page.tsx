'use client';

import { useEffect, useState } from 'react';
import PortfolioClientPage from "@/components/portfolio/PortfolioClientPage";
import { portfolioItems as staticPortfolioItems } from "@/data/portfolio-items";
import { getPortfolioItems } from "@/lib/firebase/firestore";
import type { PortfolioItem } from "@/types/firebase";
import Balancer from "react-wrap-balancer";
import Template from "../template";
import { Loader2 } from "lucide-react";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>(staticPortfolioItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFirestoreItems = async () => {
      try {
        const firestoreItems = await getPortfolioItems();

        // Transformer les items Firestore pour correspondre au format attendu
        const transformedItems = firestoreItems.map((item: PortfolioItem) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          categories: [item.category],
          coverImage: {
            url: item.imageUrl,
            hint: item.title,
          },
          tags: item.tags,
          featured: item.featured,
        }));

        // Combiner les items statiques et Firestore (Firestore en premier)
        setItems([...transformedItems, ...staticPortfolioItems]);
      } catch (error) {
        console.error('Error loading Firestore items:', error);
        // En cas d'erreur, garder les items statiques
      } finally {
        setIsLoading(false);
      }
    };

    loadFirestoreItems();
  }, []);

  if (isLoading) {
    return (
      <Template>
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </Template>
    );
  }

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
            <Balancer>Explorez nos créations</Balancer>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            <Balancer>
              Chaque projet est une nouvelle aventure. Plongez dans notre univers et découvrez comment nous donnons vie aux ambitions de nos clients.
            </Balancer>
          </p>
        </div>
        <PortfolioClientPage items={items} />
      </div>
    </Template>
  );
}
