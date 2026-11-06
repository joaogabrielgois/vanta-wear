import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { formatBRL, CATEGORY_LABEL } from '../types';
import { useFavorites } from '../store/favorites';
import { getStock } from '../data/products';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(product.id);
  const totalStock = product.colors.reduce(
    (sum, c) => sum + product.sizes.reduce((s, z) => s + getStock(product, c.name, z), 0),
    0,
  );
  const soldOut = totalStock === 0;
  const offset = index % 3 === 1 ? 'md:mt-24' : index % 3 === 2 ? 'md:mt-10' : '';

  return (
    <article className={`group relative ${offset}`}>
      <Link to={`/produto/${product.slug}`} className="block" aria-label={`Ver ${product.name}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-vanta-ink">
          <img src={`${import.meta.env.BASE_URL}products/${product.slug}.jpg`} alt={product.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transform-none" />
          <span className="absolute inset-0 flex items-end p-4 font-display text-[clamp(3rem,7vw,6rem)] leading-none text-vanta-white/10 select-none" aria-hidden="true">
            {product.category.slice(0, 3).toUpperCase()}
          </span>
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-vanta-white text-vanta-black text-[10px] tracking-[0.25em] uppercase px-2 py-1">Novo</span>
          )}
          {soldOut && (
            <span className="absolute bottom-3 left-3 bg-vanta-black text-vanta-white text-[10px] tracking-[0.25em] uppercase px-2 py-1">Esgotado na simulação</span>
          )}
        </div>
        <div className="mt-4 flex justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-vanta-stone">{CATEGORY_LABEL[product.category]}</p>
            <h3 className="mt-1 text-sm font-medium uppercase tracking-wide">{product.name}</h3>
          </div>
          <p className="text-sm tabular-nums">{formatBRL(product.price)}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle(product.id)}
        aria-pressed={fav}
        aria-label={`${fav ? 'Remover' : 'Adicionar'} ${product.name} ${fav ? 'dos' : 'aos'} favoritos`}
        className={`absolute top-3 right-3 h-9 px-3 text-[10px] uppercase tracking-[0.2em] border transition-colors ${
          fav ? 'bg-vanta-red border-vanta-red text-vanta-white' : 'bg-vanta-white/90 border-vanta-black text-vanta-black hover:bg-vanta-black hover:text-vanta-white'
        }`}
      >
        {fav ? '♥ Salvo' : '♡ Salvar'}
      </button>
    </article>
  );
}
