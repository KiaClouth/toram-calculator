import { create } from "zustand";

// 应用客户端状态数据类型定义
export interface AppState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set(() => ({ bears: 0 })),
}));

