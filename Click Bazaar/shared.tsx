import React, { createContext, useMemo, useState, useEffect } from "react";
import type { Product } from "./types";

/* =========================================================
   HELPERS
   ========================================================= */

export const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
};

const safeParse = <T,>(value: string | null, fallback: T): T => {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const safeStringify = (value: any) => {
  try {
    return JSON.stringify(value);
  } catch {
    return "[]";
  }
};

/* =========================================================
   TYPES
   ========================================================= */

export type CartItem = {
  id: string;
  qty: number;
};

export type AppContextType = {
  cart: CartItem[];
  wishlist: string[];

  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQty: (id: string, qty: number) => void;

  toggleWishlist: (id: string) => void;
  clearWishlist: () => void;

  /** UI background hint used by pages (keeps backwards compatibility) */
  bgCategory: string;
  setBgCategory: (cat: string) => void;

  getCartCount: () => number;
  getCartTotal: (products: Product[]) => number;
};

/* =========================================================
   CONTEXT
   ========================================================= */

export const AppContext = createContext<AppContextType | null>(null);

/* =========================================================
   PROVIDER
   ========================================================= */

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [bgCategory, setBgCategory] = useState<string>('General');

  /* ================================
     LOAD FROM LOCAL STORAGE
     ================================ */
  useEffect(() => {
    const savedCart = safeParse<CartItem[]>(localStorage.getItem("clickbazaar.cart"), []);
    const savedWishlist = safeParse<string[]>(localStorage.getItem("clickbazaar.wishlist"), []);
    const savedBg = safeParse<string>(localStorage.getItem('clickbazaar.bgCategory'), 'General');

    setCart(Array.isArray(savedCart) ? savedCart : []);
    setWishlist(Array.isArray(savedWishlist) ? savedWishlist : []);
    setBgCategory(savedBg || 'General');
  }, []);

  /* ================================
     SAVE TO LOCAL STORAGE
     ================================ */
  useEffect(() => {
    localStorage.setItem("clickbazaar.cart", safeStringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("clickbazaar.wishlist", safeStringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('clickbazaar.bgCategory', String(bgCategory || 'General'));
    } catch {
      // ignore
    }
  }, [bgCategory]);

  /* ================================
     CART METHODS
     ================================ */
  const addToCart = (id: string, qty: number = 1) => {
    if (!id) return;
    setCart((prev) => {
      const existing = prev.find((x) => x.id === id);
      if (existing) {
        return prev.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
      }
      return [...prev, { id, qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((x) => x.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQty = (id: string, qty: number) => {
    const safeQty = Math.max(1, Math.min(99, qty));
    setCart((prev) => prev.map((x) => (x.id === id ? { ...x, qty: safeQty } : x)));
  };

  /* ================================
     WISHLIST METHODS
     ================================ */
  const toggleWishlist = (id: string) => {
    if (!id) return;
    setWishlist((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  /* ================================
     STATS
     ================================ */
  const getCartCount = () => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  };

  const getCartTotal = (products: Product[]) => {
    return cart.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return acc;
      return acc + product.price * item.qty;
    }, 0);
  };

  /* ================================
     MOBILE SAFE GLOBAL FIX
     (Prevents right-side blank space)
     ================================ */
  useEffect(() => {
    // prevent accidental horizontal overflow caused by transforms/absolute blobs
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const value = useMemo<AppContextType>(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      clearCart,
      updateQty,
      toggleWishlist,
      clearWishlist,
      bgCategory,
      setBgCategory,
      getCartCount,
      getCartTotal,
    }),
    [cart, wishlist, bgCategory]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/* =========================================================
   UI HELPERS / RE-EXPORTS
   Components live in `components/` — re-export here for
   backwards-compatible imports from `shared`.
   ========================================================= */

export { CategoryBackground } from './components/CategoryBackground';
export { SiteLoader } from './components/SiteLoader';
export { TransactionLoader } from './components/TransactionLoader';

