import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import type { CartLine, Product, Size } from '../types';
import { getStock, products } from '../data/products';

const STORAGE_KEY = 'vanta:cart:v1';

type Action =
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'add': {
      const exists = state.some((l) => l.key === action.line.key);
      return exists
        ? state.map((l) => (l.key === action.line.key ? { ...l, qty: l.qty + action.line.qty } : l))
        : [...state, action.line];
    }
    case 'setQty':
      return state.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l));
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
  }
}

/** Valida uma quantidade de uma variante contra o catálogo e o estoque demonstrativo. */
export function validateLine(product: Product | undefined, color: string, size: Size, qty: number): string | null {
  if (!product) return 'Produto não encontrado.';
  if (!product.colors.some((c) => c.name === color)) return 'Cor indisponível para este produto.';
  if (!product.sizes.includes(size)) return 'Tamanho indisponível para este produto.';
  if (qty < 1) return 'A quantidade mínima é 1.';
  const stock = getStock(product, color, size);
  if (stock === 0) return 'Esta variante está esgotada na simulação.';
  if (qty > stock) return `Restam apenas ${stock} unidade(s) desta variante na simulação.`;
  return null;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (productId: string, color: string, size: Size, qty?: number) => string | null;
  setQty: (key: string, qty: number) => string | null;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    // Descarta linhas inválidas ou acima do estoque atual
    return parsed.filter((l) => !validateLine(products.find((p) => p.id === l.productId), l.color, l.size, l.qty));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, readStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* armazenamento indisponível: carrinho segue em memória */
    }
  }, [lines]);

  const add = useCallback<CartContextValue['add']>(
    (productId, color, size, qty = 1) => {
      const product = products.find((p) => p.id === productId);
      const key = `${productId}|${color}|${size}`;
      const current = lines.find((l) => l.key === key)?.qty ?? 0;
      const error = validateLine(product, color, size, current + qty);
      if (error) return error;
      dispatch({ type: 'add', line: { key, productId, color, size, qty } });
      return null;
    },
    [lines],
  );

  const setQty = useCallback<CartContextValue['setQty']>(
    (key, qty) => {
      const line = lines.find((l) => l.key === key);
      if (!line) return 'Item não encontrado.';
      if (qty < 1) {
        dispatch({ type: 'remove', key });
        return null;
      }
      const error = validateLine(products.find((p) => p.id === line.productId), line.color, line.size, qty);
      if (error) return error;
      dispatch({ type: 'setQty', key, qty });
      return null;
    },
    [lines],
  );

  const remove = useCallback((key: string) => dispatch({ type: 'remove', key }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, l) => sum + (products.find((p) => p.id === l.productId)?.price ?? 0) * l.qty, 0);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    return { lines, count, subtotal, add, setQty, remove, clear };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider');
  return ctx;
}
