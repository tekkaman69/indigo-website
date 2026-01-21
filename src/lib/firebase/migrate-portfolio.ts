import { addPortfolioItem } from './firestore';
import { portfolioItems } from '@/data/portfolio-items';

/**
 * Migre tous les projets statiques vers Firestore
 * @returns Le nombre de projets migrés avec succès
 */
export async function migrateStaticPortfolioToFirestore(): Promise<{
  success: number;
  errors: number;
  total: number;
}> {
  let success = 0;
  let errors = 0;
  const total = portfolioItems.length;

  for (const item of portfolioItems) {
    try {
      // Transformer le format statique en format Firestore
      await addPortfolioItem({
        title: item.title,
        description: item.description,
        category: item.categories[0] || 'Autre',
        date: item.date || new Date().toISOString().split('T')[0],
        imageUrl: item.coverImage.url,
        tags: item.tags || [],
        featured: item.featured || false,
      } as any);

      success++;
      console.log(`✅ Migré: ${item.title}`);
    } catch (error) {
      errors++;
      console.error(`❌ Erreur pour ${item.title}:`, error);
    }
  }

  return { success, errors, total };
}
