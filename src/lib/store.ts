import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: async () => {
        await fetch('/api/auth/me', { method: 'POST' });
        set({ user: null });
        window.location.href = '/';
      },
    }),
    { name: 'auth-store' }
  )
);

interface CartItem {
  cart_id?: number;
  product_id: number;
  name: string;
  brand: string;
  price: number;
  discount: number;
  images: string;
  quantity: number;
  stock: number;
}

interface CartStore {
  items: CartItem[];
  count: number;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  count: 0,
  setItems: (items) => set({ items, count: items.reduce((a, b) => a + b.quantity, 0) }),
  addItem: (item) => {
    const existing = get().items.find(i => i.product_id === item.product_id);
    if (existing) {
      get().updateQty(item.product_id, existing.quantity + item.quantity);
    } else {
      const items = [...get().items, item];
      set({ items, count: items.reduce((a, b) => a + b.quantity, 0) });
    }
  },
  removeItem: (productId) => {
    const items = get().items.filter(i => i.product_id !== productId);
    set({ items, count: items.reduce((a, b) => a + b.quantity, 0) });
  },
  updateQty: (productId, quantity) => {
    const items = get().items.map(i => i.product_id === productId ? { ...i, quantity } : i).filter(i => i.quantity > 0);
    set({ items, count: items.reduce((a, b) => a + b.quantity, 0) });
  },
  clear: () => set({ items: [], count: 0 }),
}));

interface CompareStore {
  items: any[];
  addItem: (product: any) => boolean;
  removeItem: (productId: number) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().items.length >= 4) return false;
        if (get().items.find((i: any) => i.product_id === product.product_id)) return true;
        set({ items: [...get().items, product] });
        return true;
      },
      removeItem: (productId) => set({ items: get().items.filter((i: any) => i.product_id !== productId) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'compare-store' }
  )
);
