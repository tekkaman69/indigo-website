import { useEffect } from 'react';

/**
 * Verrouille le scroll du body pendant qu'un overlay plein écran est ouvert
 * (ex: ProjectViewer). Utilise position:fixed plutôt que overflow:hidden seul
 * pour neutraliser le rebond de scroll iOS Safari, et restaure la position
 * de scroll exacte à la fermeture.
 */
export function useBodyScrollLock(isLocked: boolean): void {
  useEffect(() => {
    if (!isLocked) return;

    const scrollY = window.scrollY;
    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [isLocked]);
}
