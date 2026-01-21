'use client';

import { use, useEffect, useState } from "react";
import { portfolioItems } from "@/data/portfolio-items";
import { getPortfolioItemById } from "@/lib/firebase/firestore";
import type { PortfolioItem } from "@/types/firebase";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Template from "@/app/template";
import { motion } from "framer-motion";
import { Section } from "@/types/portfolio-editor";

type PortfolioDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { id } = use(params);
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      try {
        // D'abord chercher dans les items statiques
        const staticItem = portfolioItems.find(p => p.id === id);

        if (staticItem) {
          setItem(staticItem);
          setIsLoading(false);
          return;
        }

        // Si pas trouvé, chercher dans Firestore
        const firestoreItem = await getPortfolioItemById(id);

        if (firestoreItem) {
          setItem({
            ...firestoreItem,
            sections: firestoreItem.sections || [],
          });
        }
      } catch (error) {
        console.error('Error loading item:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadItem();
  }, [id]);

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

  if (!item) {
    notFound();
  }

  return (
    <Template>
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-8">
             <Link href="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au portfolio
            </Link>
          </Button>
        </div>

        <header className="mb-12 max-w-4xl mx-auto text-center">
            {item.categories && item.categories.length > 0 && (
              <div className="flex justify-center gap-2 mb-4">
                  {item.categories.map((cat: string) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                  ))}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                <Balancer>{item.title}</Balancer>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
                <Balancer>{item.longDescription || item.description}</Balancer>
            </p>
        </header>

        {item.sections && item.sections.length > 0 && (
          <div className="space-y-12">
            {item.sections.map((section: Section, sectionIndex: number) => (
              <div key={section.id} style={{ marginTop: `${section.marginTop}px`, marginBottom: `${section.marginBottom}px` }}>
                <div
                  className="grid w-full"
                  style={{
                    gridTemplateColumns: `repeat(${section.columns}, 1fr)`,
                    gap: `${section.gap}px`,
                  }}
                >
                  {section.blocks.map((block) => {
                    if (block.type === 'image' && block.src) {
                      const aspectRatioClass = {
                        'auto': 'aspect-auto',
                        '1:1': 'aspect-square',
                        '4:5': 'aspect-[4/5]',
                        '16:9': 'aspect-video',
                        '21:9': 'aspect-[21/9]',
                        '3:4': 'aspect-[3/4]',
                      }[block.ratio] || 'aspect-video';

                      return (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="overflow-hidden"
                          style={{
                            borderRadius: `${block.borderRadius}px`,
                            padding: `${block.padding}px`,
                            background: block.background,
                          }}
                        >
                          <div className={`relative w-full ${block.ratio === 'auto' ? 'min-h-[400px]' : aspectRatioClass}`}>
                            <img
                              src={block.src}
                              alt={block.alt || ''}
                              className="absolute inset-0 w-full h-full"
                              style={{
                                objectFit: block.objectFit || 'cover',
                                objectPosition: block.position ? `${block.position.x}% ${block.position.y}%` : 'center',
                              }}
                            />
                          </div>
                          {block.caption && (
                            <div className="mt-2 text-sm text-muted-foreground text-center">{block.caption}</div>
                          )}
                        </motion.div>
                      );
                    }
                    if (block.type === 'video' && block.src) {
                      const getEmbedUrl = (url: string, source: string) => {
                        if (source === 'youtube') {
                          const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
                          return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
                        }
                        if (source === 'vimeo') {
                          const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
                          return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
                        }
                        return url;
                      };
                      const embedUrl = getEmbedUrl(block.src, block.source);
                      return (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="relative overflow-hidden rounded-lg"
                          style={{
                            borderRadius: `${block.borderRadius}px`,
                            padding: `${block.padding}px`,
                            background: block.background,
                          }}
                        >
                          {block.source === 'upload' ? (
                            <video
                              src={block.src}
                              poster={block.poster}
                              controls={block.controls}
                              autoPlay={block.autoplay}
                              loop={block.loop}
                              muted={block.muted}
                              className="w-full h-auto"
                            />
                          ) : (
                            <iframe
                              src={embedUrl || ''}
                              className="w-full aspect-video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          )}
                        </motion.div>
                      );
                    }
                    if (block.type === 'text') {
                      return (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="prose prose-invert max-w-none"
                          style={{
                            textAlign: block.textAlign,
                            fontSize: block.fontSize ? `${block.fontSize}px` : undefined,
                            lineHeight: block.lineHeight,
                            padding: `${block.padding}px`,
                          }}
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      );
                    }
                    if (block.type === 'gallery' && block.images && block.images.length > 0) {
                      const aspectRatioClass = {
                        'auto': 'aspect-auto',
                        '1:1': 'aspect-square',
                        '4:5': 'aspect-[4/5]',
                        '16:9': 'aspect-video',
                        '21:9': 'aspect-[21/9]',
                        '3:4': 'aspect-[3/4]',
                      }[block.ratio] || 'aspect-video';

                      return (
                        <motion.div
                          key={block.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {block.displayMode === 'grid' && (
                            <div
                              className="grid w-full"
                              style={{
                                gridTemplateColumns: `repeat(${block.columns || 3}, 1fr)`,
                                gap: `${block.gap}px`,
                              }}
                            >
                              {block.images.map((img) => (
                                <div key={img.id}>
                                  <div className={`relative w-full ${block.ratio === 'auto' ? 'min-h-[300px]' : aspectRatioClass}`}>
                                    <img
                                      src={img.src}
                                      alt={img.alt || ''}
                                      className="absolute inset-0 w-full h-full object-cover"
                                    />
                                  </div>
                                  {img.caption && (
                                    <div className="mt-1 text-xs text-muted-foreground text-center">{img.caption}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {block.displayMode === 'masonry' && (
                            <div
                              className="columns-3 gap-4 w-full"
                              style={{
                                columnGap: `${block.gap}px`,
                              }}
                            >
                              {block.images.map((img) => (
                                <div key={img.id} className="mb-4 break-inside-avoid">
                                  <img
                                    src={img.src}
                                    alt={img.alt || ''}
                                    className="w-full h-auto object-cover"
                                  />
                                  {img.caption && (
                                    <div className="mt-1 text-sm text-muted-foreground">{img.caption}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          {block.displayMode === 'slider' && (
                            <div className={`relative w-full ${block.ratio === 'auto' ? 'min-h-[400px]' : aspectRatioClass}`}>
                              <img
                                src={block.images[0].src}
                                alt={block.images[0].alt || ''}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              {block.images[0].caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2 backdrop-blur-sm">
                                  {block.images[0].caption}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Template>
  );
}

// generateStaticParams is commented out as it is not needed for client-side rendering of this page.
// If you want to pre-build these pages, we would need to adjust the approach.
// export async function generateStaticParams() {
//   return portfolioItems.map((item) => ({
//     id: item.id,
//   }));
// }
