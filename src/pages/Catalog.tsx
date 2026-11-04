import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { CATEGORY_LABEL, formatBRL, type Category, type Size } from '../types';
import { getStock } from '../data/products';

const SIZES: Size[] = ['P', 'M', 'G', 'GG', 'U'];
const CATEGORIES = Object.keys(CATEGORY_LABEL) as Category[];
const MAX_PRICE = Math.max(...products.map((p) => p.price));

type Sort = 'relevancia' | 'menor' | 'maior';

export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const initialCat = params.get('categoria');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState<Category | 'todas'>(
    CATEGORIES.includes(initialCat as Category) ? (initialCat as Category) : 'todas',
  );
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [size, setSize] = useState<Size | 'todos'>('todos');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('relevancia');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter((p) => {
      if (q && !`${p.name} ${p.description} ${CATEGORY_LABEL[p.category]}`.toLowerCase().includes(q)) return false;
      if (category !== 'todas' && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      if (size !== 'todos' && !p.sizes.includes(size)) return false;
      if (size !== 'todos' && getStock(p, p.colors[0].name, size) === 0 && inStockOnly) {
        // quando filtra tamanho + estoque, considera qualquer cor disponível
        const anyColor = p.colors.some((c) => getStock(p, c.name, size) > 0);
        if (!anyColor) return false;
      }
      if (inStockOnly && !p.colors.some((c) => p.sizes.some((s) => getStock(p, c.name, s) > 0))) return false;
      return true;
    });
    if (sort === 'menor') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'maior') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [query, category, maxPrice, size, inStockOnly, sort]);

  const applyQuery = (next: string) => {
    setQuery(next);
    const p = new URLSearchParams(params);
    next ? p.set('q', next) : p.delete('q');
    setParams(p, { replace: true });
  };

  const clearAll = () => {
    setQuery('');
    setCategory('todas');
    setMaxPrice(MAX_PRICE);
    setSize('todos');
    setInStockOnly(false);
    setSort('relevancia');
    setParams({}, { replace: true });
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16">
      <header className="mb-12">
        <p className="text-[11px] uppercase tracking-[0.4em] text-vanta-stone">Catálogo</p>
        <h1 className="mt-3 font-display uppercase text-[clamp(4rem,12vw,11rem)] leading-[0.85]">Todas as peças</h1>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-12">
        <aside aria-label="Filtros" className="space-y-10 lg:sticky lg:top-28 lg:self-start">
          <div>
            <label htmlFor="cat-busca" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">Buscar</label>
            <input
              id="cat-busca"
              type="search"
              value={query}
              onChange={(e) => applyQuery(e.target.value)}
              className="mt-2 w-full bg-transparent border-b border-vanta-black/30 focus:border-vanta-red outline-none py-2"
              placeholder="Nome ou descrição"
            />
          </div>

          <fieldset>
            <legend className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone mb-3">Categoria</legend>
            <div className="flex flex-col gap-2 text-sm">
              {(['todas', ...CATEGORIES] as const).map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="categoria" checked={category === c} onChange={() => setCategory(c)} className="accent-[#7a0f1c]" />
                  {c === 'todas' ? 'Todas' : CATEGORY_LABEL[c]}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="preco" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">
              Preço até <span className="text-vanta-black tabular-nums">{formatBRL(maxPrice)}</span>
            </label>
            <input
              id="preco"
              type="range"
              min={0}
              max={MAX_PRICE}
              step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-3 w-full accent-[#7a0f1c]"
            />
          </div>

          <fieldset>
            <legend className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone mb-3">Tamanho</legend>
            <div className="flex flex-wrap gap-2">
              {(['todos', ...SIZES] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={size === s}
                  onClick={() => setSize(s)}
                  className={`h-10 min-w-10 px-3 text-xs uppercase border transition-colors ${
                    size === s ? 'bg-vanta-black text-vanta-white border-vanta-black' : 'border-vanta-black/30 hover:border-vanta-black'
                  }`}
                >
                  {s === 'todos' ? 'Todos' : s}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} className="accent-[#7a0f1c]" />
            Somente com estoque na simulação
          </label>

          <div>
            <label htmlFor="ordem" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">Ordenar</label>
            <select id="ordem" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-2 w-full bg-transparent border-b border-vanta-black/30 py-2 outline-none">
              <option value="relevancia">Relevância</option>
              <option value="menor">Menor preço</option>
              <option value="maior">Maior preço</option>
            </select>
          </div>

          <button type="button" onClick={clearAll} className="text-[11px] uppercase tracking-[0.25em] underline underline-offset-4 hover:text-vanta-red">
            Limpar filtros
          </button>
        </aside>

        <section aria-live="polite" aria-label="Resultados">
          <p className="text-sm text-vanta-stone mb-10">{results.length} {results.length === 1 ? 'peça encontrada' : 'peças encontradas'}</p>
          {results.length === 0 ? (
            <div className="border border-dashed border-vanta-black/30 p-12 text-center">
              <p className="font-display uppercase text-4xl">Nada por aqui</p>
              <p className="mt-4 text-sm text-vanta-stone">Nenhuma peça corresponde a esses filtros. Ajuste a busca ou limpe os filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-14">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
