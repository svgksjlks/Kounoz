'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types';

const CART_STORAGE_KEY = 'kounoz_cart';
const LEGACY_STORAGE_KEY = 'app_cart';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isCartLoaded: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'id'> & { id?: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Start with empty array on initial render to perfectly match SSR HTML
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // 2. Client-side hydration & sync on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to load cart on mount:', err);
    }
    setIsLoaded(true);

    // Cross-tab live synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === CART_STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) && e.newValue) {
        try {
          const newItems = JSON.parse(e.newValue);
          if (Array.isArray(newItems)) {
            setItems(newItems);
          }
        } catch {
          // Ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 3. Save to LocalStorage whenever items change ONLY after isLoaded is true
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event('kounoz_cart_updated'));
    } catch (err) {
      console.warn('Failed to save cart to storage:', err);
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (item: Omit<CartItem, 'id'> & { id?: number }) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.product_id === item.product_id &&
          (i.color || '') === (item.color || '') &&
          (i.size || '') === (item.size || '')
      );

      let updatedList: CartItem[];
      if (existingIndex > -1) {
        updatedList = [...prev];
        updatedList[existingIndex] = {
          ...updatedList[existingIndex],
          quantity: updatedList[existingIndex].quantity + item.quantity,
          price: item.price,
          image_url: item.image_url || updatedList[existingIndex].image_url,
        };
      } else {
        const newItem: CartItem = {
          id: item.id || Date.now() + Math.floor(Math.random() * 1000),
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          image_url: item.image_url,
        };
        updatedList = [...prev, newItem];
      }

      // Direct write immediately as well to prevent any race condition
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedList));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updatedList));
      } catch {}

      return updatedList;
    });

    setIsOpen(true);
  };

  const removeItem = (id: number) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify([]));
    } catch {}
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        isCartLoaded: isLoaded,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
