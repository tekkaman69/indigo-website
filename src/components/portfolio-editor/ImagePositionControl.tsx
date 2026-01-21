'use client';

import { useState, useRef, useEffect } from 'react';
import { Label } from '@/components/ui/label';

interface ImagePositionControlProps {
  src: string;
  objectFit: 'cover' | 'contain';
  ratio: string;
  position?: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function ImagePositionControl({
  src,
  objectFit,
  ratio,
  position = { x: 50, y: 50 },
  onPositionChange,
}: ImagePositionControlProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (objectFit !== 'cover') return;
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onPositionChange({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <>
      <div>
        <Label>Image Position</Label>
        <div
          ref={containerRef}
          className="relative w-full rounded border border-border overflow-hidden bg-muted cursor-move"
          style={{
            aspectRatio: ratio === 'auto' ? '16/9' : ratio.replace(':', '/'),
          }}
          onMouseDown={handleMouseDown}
          onClick={() => setShowModal(true)}
        >
          <img
            src={src}
            alt="Position preview"
            className="object-cover w-full h-full pointer-events-none"
            style={{
              objectPosition: `${position.x}% ${position.y}%`,
            }}
          />
          {objectFit === 'cover' && (
            <div
              className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-lg"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {objectFit === 'cover' ? 'Drag to adjust position' : 'Position control only for cover mode'}
        </p>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={src}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
