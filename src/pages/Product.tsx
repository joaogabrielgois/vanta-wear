import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductBySlug, getStock, products } from '../data/products';
import { useCart, validateLine } from '../store/cart';
import { useFavorites } from '../store/favorites';
import ProductCard from '../components/ProductCard';
import { formatBRL, CATEGORY_LABEL, type Size } from '../types';
import NotFound from './NotFound';

export default function Product() {
  const { slug = '' } = useParams();
  const product = getProductBySlug(slug);
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();

  const [color, setColor] = useState(product?.colors[0]?.name ?? '');
  const [size, setSize] = useState<Size | null>(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<{ type: 'ok' | 'erro'; text: string } | null>(null);
  const [imgIndex, setImgIndex] = useState(0);

  // Reseta seleção ao trocar de produto
  useEffect(() => {
    setColor(product?.colors[0]?.name ?? '');
    setSize(null);
    setQty(1);
    setMessage(null);
    setImgIndex(0);
  }, [slug, product]);

  const related = useMemo(
    () => (product ? products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3) : []),
    [product],
  );

  if (!product) return <NotFound />;

  const stock = size ? getStock(product, color, size) : null;
  const fav = isFavorite(product.id);
  // Quantidade mostrada é limitada pelo estoque da variante selecionada
  const maxQty = size && stock ? stock : 1;

  const onAdd = () => {
    if (!size) {
      setMessage({ type: 'erro', text: 'Selecione um tamanho para continuar.' });
      return;
    }
    const error = add(product.id, color, size, qty);
    if (error) {
      setMessage({ type: 'erro', text: error });
      return;
    }
    setMessage({ type: 'ok', text: `${product.name} (${color}, ${size}) × ${qty} adicionado à sacola.` });
  };

  const sizeStatus = (s: Size) => {
    const st = getStock(product, color, s);
    return st;
  };

  // Validação em tempo real da quantidade
  const qtyError = size ? validateLine(product, color, size, qty) : null;
  const images = [
    { label: 'Frente', style: product.visual },
    { label: 'Costas', style: `linear-gradient(${200 + imgIndex * 40}deg,#0a0a0a 0%,${product.colors[0].hex} 90%)` },
    { label: 'Detalhe', style: `radial-gradient(circle at ${40 + imgIndex * 10}% 35%,#7a0f1c 0%,#0a0a0a 70%)` },
  ];

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-12">
      <nav aria-label="Trilha de navegação" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone mb-10">
        <Link to="/catalogo" className="hover:text-vanta-red">Catálogo</Link> / {CATEGORY_LABEL[product.category]} / <span className="text-vanta-black">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Galeria */}
        <div className="lg:col-span-7 grid grid-cols-[72px_1fr] gap-4">
          <div className="flex flex-col gap-3" role="tablist" aria-label="Imagens do produto">
            {images.map((img, i) => (
              <button
                key={img.label}
                role="tab"
                aria-selected={imgIndex === i}
                aria-label={`Ver imagem: ${img.label}`}
                onClick={() => setImgIndex(i)}
                className={`aspect-[3/4] border ${imgIndex === i ? 'border-vanta-red' : 'border-transparent'} overflow-hidden`}
              >
                <span className="block h-full w-full" style={{ background: img.style }} />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-vanta-ink">
            <div key={imgIndex} className="absolute inset-0 motion-safe:animate-[fadeIn_500ms_ease-out]" style={{ background: images[imgIndex].style }} role="tabpanel" aria-label={images[imgIndex].label} />
            <p className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.3em] text-vanta-white/70">Ilustrativo · {images[imgIndex].label}</p>
          </div>
        </div>

        {/* Informações */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <p className="text-[11px] uppercase tracking-[0.3em] text-vanta-stone">{CATEGORY_LABEL[product.category]}{product.campaign && ` · ${product.campaign}`}</p>
          <h1 className="mt-3 font-display uppercase text-[clamp(3rem,7vw,6rem)] leading-[0.88]">{product.name}</h1>
          <p className="mt-6 text-2xl tabular-nums">{formatBRL(product.price)}</p>
          <p className="mt-2 text-xs text-vanta-stone">Preço ilustrativo. Sem cobrança real.</p>

          <p className="mt-8 leading-relaxed">{product.description}</p>

          {/* Cor */}
          <fieldset className="mt-10">
            <legend className="text-[11px] uppercase tracking-[0.25em] mb-3">
              Cor: <span className="text-vanta-red">{color}</span>
            </legend>
            <div className="flex gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={color === c.name}
                  aria-label={`Cor ${c.name}`}
                  onClick={() => {
                    setColor(c.name);
                    setQty(1);
                    setMessage(null);
                  }}
                  className={`h-10 w-10 rounded-full border-2 ${color === c.name ? 'border-vanta-red ring-2 ring-offset-2 ring-vanta-red' : 'border-vanta-black/20'}`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </fieldset>

          {/* Tamanho */}
          <fieldset className="mt-8">
            <legend className="text-[11px] uppercase tracking-[0.25em] mb-3">Tamanho</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const st = sizeStatus(s);
                const out = st === 0;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    aria-disabled={out}
                    onClick={() => {
                      setSize(s);
                      setQty(1);
                      setMessage(out ? { type: 'erro', text: `Tamanho ${s} esgotado na simulação para ${color}.` } : null);
                    }}
                    className={`h-12 min-w-12 px-4 text-sm uppercase border transition-colors ${
                      size === s ? 'bg-vanta-black text-vanta-white border-vanta-black' : 'border-vanta-black/30 hover:border-vanta-black'
                    } ${out ? 'line-through opacity-40' : ''}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-vanta-stone" aria-live="polite">
              {size === null
                ? 'Escolha um tamanho para ver o estoque demonstrativo.'
                : stock === 0
                  ? 'Esgotado na simulação.'
                  : `Estoque demonstrativo: ${stock} unidade(s).`}
            </p>
          </fieldset>

          {/* Quantidade */}
          <div className="mt-8">
            <label htmlFor="qty" className="text-[11px] uppercase tracking-[0.25em]">Quantidade</label>
            <div className="mt-3 flex items-center gap-4">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Diminuir quantidade" className="h-11 w-11 border border-vanta-black/30">−</button>
              <input
                id="qty"
                type="number"
                min={1}
                max={maxQty}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="h-11 w-16 text-center bg-transparent border border-vanta-black/30"
              />
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Aumentar quantidade" className="h-11 w-11 border border-vanta-black/30">+</button>
            </div>
            {qtyError && size && <p className="mt-2 text-sm text-vanta-red" role="alert">{qtyError}</p>}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onAdd}
              disabled={!size || stock === 0}
              className="flex-1 h-14 bg-vanta-black text-vanta-white text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar à sacola
            </button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={fav}
              className={`h-14 px-6 border text-[12px] uppercase tracking-[0.2em] ${fav ? 'bg-vanta-red border-vanta-red text-vanta-white' : 'border-vanta-black'}`}
            >
              {fav ? '♥ Salvo' : '♡ Salvar'}
            </button>
          </div>

          {message && (
            <p role={message.type === 'erro' ? 'alert' : 'status'} className={`mt-4 text-sm ${message.type === 'erro' ? 'text-vanta-red' : 'text-vanta-black'}`}>
              {message.text}{' '}
              {message.type === 'ok' && <Link to="/carrinho" className="underline underline-offset-4">Ver sacola</Link>}
            </p>
          )}

          <details className="mt-12 border-t border-vanta-black/15 pt-6" open>
            <summary className="cursor-pointer text-[11px] uppercase tracking-[0.25em]">Detalhes e composição</summary>
            <ul className="mt-4 space-y-2 text-sm list-disc pl-5">
              {product.details.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </details>
          <details className="mt-4 border-t border-vanta-black/15 pt-6">
            <summary className="cursor-pointer text-[11px] uppercase tracking-[0.25em]">Envio e devolução (demonstrativo)</summary>
            <p className="mt-4 text-sm leading-relaxed">Informações ilustrativas. Prazos e valores reais dependem da integração de logística escolhida.</p>
          </details>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-32">
          <h2 id="relacionados" className="font-display uppercase text-5xl md:text-7xl mb-12">Também da categoria</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
