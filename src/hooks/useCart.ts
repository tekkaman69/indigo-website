'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '@/types/marketplace';

const CART_KEY = 'indigo_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setItems(parsed);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, isLoading]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.service.id === item.service.id
      );

      if (existingIndex >= 0) {
        // Update existing item
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
          answers: { ...updated[existingIndex].answers, ...item.answers },
        };
        return updated;
      }

      // Add new item
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((serviceId: string) => {
    setItems((prev) => prev.filter((item) => item.service.id !== serviceId));
  }, []);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(serviceId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.service.id === serviceId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const updateAnswers = useCallback((serviceId: string, answers: Record<string, any>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.service.id === serviceId ? { ...item, answers } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem(CART_KEY);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total,
    itemCount,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    updateAnswers,
    clearCart,
  };
}
