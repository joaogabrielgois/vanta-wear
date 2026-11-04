export type Category = 'camisetas' | 'moletons' | 'calcas' | 'acessorios';
export type Size = 'P' | 'M' | 'G' | 'GG' | 'U';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number; // em centavos de real
  description: string;
  details: string[];
  sizes: Size[];
  colors: ColorOption[];
  /** Estoque DEMONSTRATIVO por variante. Chave: `${cor}|${tamanho}` */
  stock: Record<string, number>;
  /** Gradiente CSS usado como placeholder visual até existirem fotos licenciadas */
  visual: string;
  isNew?: boolean;
  campaign?: string;
}

export interface CartLine {
  key: string;
  productId: string;
  color: string;
  size: Size;
  qty: number;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  camisetas: 'Camisetas',
  moletons: 'Moletons',
  calcas: 'Calças',
  acessorios: 'Acessórios',
};

export const formatBRL = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
