export interface HelpSection {
  id: string;
  title: string;
  content: string;
  order: number;
  parentId?: string;
  role?: 'gestor' | 'coordinador_subred' | 'coordinador_general' | null;
  icon?: string;
}

export interface HelpMenu {
  id: string;
  title: string;
  order: number;
  sections: HelpSection[];
  role?: 'gestor' | 'coordinador_subred' | 'coordinador_general' | null;
  icon?: string;
}