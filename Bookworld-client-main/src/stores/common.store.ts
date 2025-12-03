import { create } from "zustand";

type State = {
  count: number;
  tokenAccess: string;
  reFreshToken: string;
};

type Actions = {
  increment: (qty: number) => void;
  decrement: (qty: number) => void;
};

export const useCountStore = create<State & Actions>((set: (arg0: { (state: { count: number; }): { count: number; }; (state: { count: number; }): { count: number; }; }) => any) => ({
  count: 100,
  tokenAccess: "",
  reFreshToken: "",
  increment: (qty: number) => set((state: { count: number; }) => ({ count: state.count + qty })),
  decrement: (qty: number) => set((state: { count: number; }) => ({ count: state.count - qty })),
}));
