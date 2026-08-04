/**
 * Lit le ratio largeur/hauteur d'un fichier image côté client (avant upload),
 * pour le mémoriser dans CommImage.ratio et éviter tout saut de mise en page
 * du masonry au chargement. Renvoie undefined si la lecture échoue.
 */
export function readImageRatio(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : undefined;
      URL.revokeObjectURL(url);
      resolve(ratio);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(undefined);
    };
    img.src = url;
  });
}

/** Lit le ratio d'une image déjà hébergée (URL) — pour les images de la bibliothèque. */
export function readImageRatioFromUrl(url: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve(
        img.naturalWidth && img.naturalHeight
          ? img.naturalWidth / img.naturalHeight
          : undefined
      );
    };
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
}
