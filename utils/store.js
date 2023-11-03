import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

export const useWriteStore = create((set) => ({
  title: "",
  description: "",
  showModalTitle: false,
  setTitle: (title) => set({ title: title }),
  setDescription: (description) => set({ description: description }),
  setShowModalTitle: (status) => set({ showModalTitle: status }),
}));

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user: user }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)