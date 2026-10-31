import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  addOrIncrementCartItem,
  calculateCartTotals,
  CartItem,
  CartTotals,
  ProductConfiguration,
  removeCartItem,
  updateCartItemQuantity,
} from '../utils/commerce';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string;
  expressCourier: boolean;
  totals: CartTotals;
  lastAddedFeedback: string | null;
  cartAnnouncement: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToBag: (config: ProductConfiguration, quantity?: number, autoOpenDrawer?: boolean) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setPromoCode: (code: string) => void;
  setExpressCourier: (enabled: boolean) => void;
}

const CART_STORAGE_KEY = 'aurelion_one_bag_v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage error
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [expressCourier, setExpressCourier] = useState(false);
  const [lastAddedFeedback, setLastAddedFeedback] = useState<string | null>(null);
  const [cartAnnouncement, setCartAnnouncement] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage error
    }
  }, [items]);

  const totals = useMemo(
    () => calculateCartTotals(items, promoCode, expressCourier),
    [items, promoCode, expressCourier]
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToBag = (
    config: ProductConfiguration,
    quantity = 1,
    autoOpenDrawer = true
  ) => {
    setItems((prev) => {
      const updated = addOrIncrementCartItem(prev, config, quantity);
      return updated;
    });
    const feedbackMsg = `Added AURELION ONE (${config.colorwayId.toUpperCase()} / ${config.materialId.toUpperCase()}) to bag.`;
    setLastAddedFeedback(feedbackMsg);
    setCartAnnouncement(feedbackMsg);

    if (autoOpenDrawer) {
      setIsOpen(true);
    }

    setTimeout(() => {
      setLastAddedFeedback((current) => (current === feedbackMsg ? null : current));
    }, 3200);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    setItems((prev) => updateCartItemQuantity(prev, variantId, quantity));
    setCartAnnouncement(
      quantity <= 0 ? 'Item removed from bag.' : `Item quantity updated to ${quantity}.`
    );
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => removeCartItem(prev, variantId));
    setCartAnnouncement('Item removed from bag.');
  };

  const clearCart = () => {
    setItems([]);
    setCartAnnouncement('Shopping bag cleared.');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        promoCode,
        expressCourier,
        totals,
        lastAddedFeedback,
        cartAnnouncement,
        openCart,
        closeCart,
        toggleCart,
        addToBag,
        updateQuantity,
        removeItem,
        clearCart,
        setPromoCode,
        setExpressCourier,
      }}
    >
      {children}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {cartAnnouncement}
      </div>
    </CartContext.Provider>
  );
};

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
