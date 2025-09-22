import { create } from "zustand";

/** โครงข้อมูลในตะกร้า (ใช้ roomId เป็นคีย์หลัก) */
export type CartItem = {
  roomId: string;      // คีย์หลักเดิม
  idUser: string;
  nameHotel: string;
  nameFull: string;
  address: string;
  price: number;       // ราคา "รวม" ของห้องนี้
  url: string;
  dateCheck: string;
  dateOut: string;
  dayCount: number;    // ตัวเลขไว้โชว์อย่างเดียว
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (roomId: string) => void;
  clear: () => void;
  total: () => number;
  exists: (roomId: string) => boolean;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],

  /** เพิ่มลงตะกร้า (กันซ้ำด้วย roomId) */
  add: (item) =>
    set((state) => {
      if (state.items.some((it) => it.roomId === item.roomId)) return state;
      return { items: [...state.items, item] };
    }),

  /** ลบรายการตาม roomId */
  remove: (roomId) =>
    set((state) => ({
      items: state.items.filter((it) => it.roomId !== roomId),
    })),

  /** ล้างทั้งหมด */
  clear: () => set({ items: [] }),

  /** รวมยอดราคา */
  total: () =>
    get().items.reduce((sum, it) => sum + Number(it.price ?? 0), 0),

  /** เช็คว่ามี item นี้ในตะกร้าหรือยัง */
  exists: (roomId) => get().items.some((it) => it.roomId === roomId),
}));