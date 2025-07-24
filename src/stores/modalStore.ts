import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  selectedDrinkId: string | null;
  openModal: (drinkId: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  selectedDrinkId: null,
  openModal: (drinkId: string) => set({ isOpen: true, selectedDrinkId: drinkId }),
  closeModal: () => set({ isOpen: false, selectedDrinkId: null }),
}));
