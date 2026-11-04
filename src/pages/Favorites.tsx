import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useFavorites } from '../store/favorites';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { ids } = useFavorites();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16">
      <h1 className="font-display uppercase text-[clamp(4rem,12vw,10rem)] leading-[0.85] mb-12">Favoritos</h1>
      {items.length === 0 ? (
        <div className="border border-dashed border-vanta-black/30 p-16 text-center">
          <p className="text-vanta-stone">Nenhuma peça salva ainda. Use “Salvar” nas peças que quiser acompanhar.</p>
          <Link to="/catalogo" className="inline-block mt-8 underline underline-offset-4">Ver catálogo</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
