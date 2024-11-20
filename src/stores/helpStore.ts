import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { HelpMenu, HelpSection } from '../types/help';

interface HelpStore {
  menus: HelpMenu[];
  sections: HelpSection[];
  isEditing: boolean;
  addMenu: (menu: Omit<HelpMenu, 'id'>) => void;
  updateMenu: (id: string, updates: Partial<HelpMenu>) => void;
  deleteMenu: (id: string) => void;
  addSection: (section: Omit<HelpSection, 'id'>) => void;
  updateSection: (id: string, updates: Partial<HelpSection>) => void;
  deleteSection: (id: string) => void;
  setEditing: (editing: boolean) => void;
  reorderMenu: (id: string, newOrder: number) => void;
  reorderSection: (id: string, newOrder: number) => void;
}

export const useHelpStore = create<HelpStore>()(
  persist(
    (set, get) => ({
      menus: [],
      sections: [],
      isEditing: false,

      addMenu: (menu) => set((state) => ({
        menus: [...state.menus, { ...menu, id: crypto.randomUUID() }]
      })),

      updateMenu: (id, updates) => set((state) => ({
        menus: state.menus.map((menu) =>
          menu.id === id ? { ...menu, ...updates } : menu
        )
      })),

      deleteMenu: (id) => set((state) => ({
        menus: state.menus.filter((menu) => menu.id !== id),
        sections: state.sections.filter((section) => section.parentId !== id)
      })),

      addSection: (section) => set((state) => ({
        sections: [...state.sections, { ...section, id: crypto.randomUUID() }]
      })),

      updateSection: (id, updates) => set((state) => ({
        sections: state.sections.map((section) =>
          section.id === id ? { ...section, ...updates } : section
        )
      })),

      deleteSection: (id) => set((state) => ({
        sections: state.sections.filter((section) => section.id !== id)
      })),

      setEditing: (editing) => set({ isEditing: editing }),

      reorderMenu: (id, newOrder) => set((state) => {
        const menus = [...state.menus];
        const menuIndex = menus.findIndex((m) => m.id === id);
        if (menuIndex === -1) return state;

        const menu = menus[menuIndex];
        menus.splice(menuIndex, 1);
        menus.splice(newOrder, 0, menu);

        return {
          menus: menus.map((m, i) => ({ ...m, order: i }))
        };
      }),

      reorderSection: (id, newOrder) => set((state) => {
        const sections = [...state.sections];
        const sectionIndex = sections.findIndex((s) => s.id === id);
        if (sectionIndex === -1) return state;

        const section = sections[sectionIndex];
        sections.splice(sectionIndex, 1);
        sections.splice(newOrder, 0, section);

        return {
          sections: sections.map((s, i) => ({ ...s, order: i }))
        };
      }),
    }),
    {
      name: 'help-storage',
    }
  )
);