import { create } from "zustand";

export type CartItem = {
  roomId: string;
  idUser: string;
  nameHotel: string;
  nameFull: string;
  address: string;
  price: number;
  url: string;
  dateCheck: string;
  dateOut: string;
  dayCount: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (roomId: string) => void;
  clear: () => void;
  total: () => number;
  exists: (roomId: string) => boolean;
};

// 🔒 Singleton guard (prevents multiple store instances across Expo Router chunks)
const createCartStore = () =>
  create<CartState>((set, get) => ({
    items: [],
    add: (item) =>
      set((state) => {
        if (state.items.some((it) => it.roomId === item.roomId)) return state;
        return { items: [...state.items, item] };
      }),
    remove: (roomId) =>
      set((state) => ({ items: state.items.filter((it) => it.roomId !== roomId) })),
    clear: () => set({ items: [] }),
    total: () => get().items.reduce((sum, it) => sum + Number(it.price ?? 0), 0),
    exists: (roomId) => get().items.some((it) => it.roomId === roomId),
  }));

declare global {
  // eslint-disable-next-line no-var
  var __CART_STORE__: ReturnType<typeof createCartStore> | undefined;
}

export const useCart = global.__CART_STORE__ ?? (global.__CART_STORE__ = createCartStore());
