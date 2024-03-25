import { create } from "zustand";

// 应用客户端状态数据类型定义
export interface AppState {
  global: {
    isBBLBackgroundRendered: boolean;
    updatedBBLBackgroundState: () => void;
  };
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  global: {
    isBBLBackgroundRendered: false,
    updatedBBLBackgroundState: () => set((state) => ({
      ...state,
      global: { ...state.global, isBBLBackgroundRendered: true },
    })),
  },
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set(() => ({ bears: 0 })),
}));

