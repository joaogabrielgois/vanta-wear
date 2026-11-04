import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart';
import { getStock, products } from '../data/products';
import { formatBRL } from '../types';

export default function Cart() {
  const { lines, subtotal, count, setQty, remove } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const changeQty = (key: string, qty: number) => {
    const err = setQty(key, qty);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[key] = err;
      else delete next[key];
      return next;
    });
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[1000px] px-4 md:px-8 py-32 text-center">
        <h1 className="font-display uppercase text-[clamp(4rem,12vw,10rem)] leading-none">Sacola vazia</h1>
        <p className="mt-6 text-vanta-stone">Nenhuma peça por aqui ainda.</p>
        <Link to="/catalogo" className="inline-block mt-10 bg-vanta-black text-vanta-white px-8 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red">
          Ir ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16">
      <h1 className="font-display uppercase text-[clamp(4rem,10vw,9rem)] leading-[0.85] mb-12">Sacola <span className="text-vanta-red">({count})</span></h1>
      <div className="grid lg:grid-cols-12 gap-12">
        <ul className="lg:col-span-8 divide-y divide-vanta-black/15 border-y border-vanta-black/15" aria-label="Itens da sacola">
          {lines.map((line) => {
            const product = products.find((p) => p.id === line.productId);
            if (!product) return null;
            const stock = getStock(product, line.color, line.size);
            const err = errors[line.key];
            return (
              <li key={line.key} className="py-8 grid grid-cols-[112px_1fr] md:grid-cols-[160px_1fr] gap-6">
                <Link to={`/produto/${product.slug}`} className="aspect-[3/4] block" aria-label={`Ver ${product.name}`}>
                  <span className="block h-full w-full" style={{ background: product.visual }} />
                </Link>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h2 className="font-medium uppercase tracking-wide">{product.name}</h2>
                      <p className="text-sm text-vanta-stone mt-1">{line.color} · Tamanho {line.size}</p>
                      <p className="text-xs text-vanta-stone mt-1">Estoque demonstrativo: {stock}</p>
                    </div>
                    <p className="tabular-nums">{formatBRL(product.price * line.qty)}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label htmlFor={`qty-${line.key}`} className="sr-only">Quantidade de {product.name}</label>
                    <button type="button" onClick={() => changeQty(line.key, line.qty - 1)} aria-label={`Diminuir ${product.name}`} className="h-10 w-10 border border-vanta-black/30">−</button>
                    <input
                      id={`qty-${line.key}`}
                      type="number"
                      min={1}
                      max={stock}
                      value={line.qty}
                      onChange={(e) => changeQty(line.key, Number(e.target.value))}
                      className="h-10 w-16 text-center bg-transparent border border-vanta-black/30"
                    />
                    <button type="button" onClick={() => changeQty(line.key, line.qty + 1)} aria-label={`Aumentar ${product.name}`} className="h-10 w-10 border border-vanta-black/30">+</button>
                    <button type="button" onClick={() => remove(line.key)} className="ml-auto text-[11px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-vanta-red">
                      Remover
                    </button>
                  </div>
                  {err && <p role="alert" className="text-sm text-vanta-red">{err}</p>}
                </div>
              </li>
            );
          })}
        </ul>

        <aside aria-labelledby="resumo" className="lg:col-span-4 lg:sticky lg:top-28 lg:self-start bg-vanta-ink text-vanta-white p-8">
          <h2 id="resumo" className="text-[11px] uppercase tracking-[0.3em] text-vanta-bone">Resumo</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal ({count} {count === 1 ? 'item' : 'itens'})</dt><dd className="tabular-nums">{formatBRL(subtotal)}</dd></div>
            <div className="flex justify-between text-vanta-stone"><dt>Frete</dt><dd>Calculado no checkout demonstrativo</dd></div>
          </dl>
          <div className="mt-6 pt-6 border-t border-vanta-white/20 flex justify-between items-baseline">
            <span className="uppercase tracking-[0.2em] text-sm">Total</span>
            <span className="font-display text-4xl tabular-nums">{formatBRL(subtotal)}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={Object.keys(errors).length > 0}
            className="mt-8 w-full h-14 bg-vanta-red text-vanta-white text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-blood disabled:opacity-40"
          >
            Ir ao checkout demonstrativo
          </button>
          {Object.keys(errors).length > 0 && <p className="mt-3 text-xs text-vanta-bone">Corrija as quantidades destacadas para continuar.</p>}
          <p className="mt-6 text-xs text-vanta-stone">Simulação. Nenhum pagamento é cobrado.</p>
        </aside>
      </div>
    </div>
  );
}
