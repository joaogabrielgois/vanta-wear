import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../store/cart';
import { useFavorites } from '../store/favorites';

const links = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/sobre', label: 'Marca & Contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const { ids } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo');
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-vanta-white/95 backdrop-blur border-b border-vanta-black/10">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 h-16 flex items-center gap-6">
        <Link to="/" className="font-display text-2xl tracking-[0.12em] text-vanta-black" aria-label="VANTA WEAR, página inicial">
          VANTA<span className="text-vanta-red">.</span>WEAR
        </Link>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-[0.2em]">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative pb-1 hover:text-vanta-red transition-colors after:absolute after:left-0 after:bottom-0 after:h-px after:bg-vanta-red after:transition-all ${
                  isActive ? 'text-vanta-red after:w-full' : 'after:w-0 hover:after:w-full'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} role="search" className="hidden lg:flex flex-1 max-w-xs ml-auto">
          <label htmlFor="busca" className="sr-only">Buscar produtos</label>
          <input
            id="busca"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar peças"
            className="w-full bg-transparent border-b border-vanta-black/30 focus:border-vanta-red outline-none py-2 text-sm"
          />
        </form>

        <div className="flex items-center gap-5 ml-auto lg:ml-0 text-[12px] uppercase tracking-[0.15em]">
          <Link to="/favoritos" className="hover:text-vanta-red" aria-label={`Favoritos, ${ids.length} itens`}>
            Fav <span className="text-vanta-red">{ids.length}</span>
          </Link>
          <Link to="/carrinho" className="hover:text-vanta-red" aria-label={`Carrinho, ${count} itens`}>
            Sacola <span className="text-vanta-red">{count}</span>
          </Link>
          <button
            type="button"
            className="md:hidden border border-vanta-black px-3 py-1"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Fechar' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <div id="menu-mobile" className="md:hidden fixed inset-x-0 top-[calc(4rem+2.25rem)] bottom-0 bg-vanta-black text-vanta-white p-8 flex flex-col gap-8">
          <form onSubmit={onSearch} role="search">
            <label htmlFor="busca-mobile" className="sr-only">Buscar produtos</label>
            <input
              id="busca-mobile"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar peças"
              className="w-full bg-transparent border-b border-vanta-white/40 py-3 text-lg outline-none"
            />
          </form>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="font-display text-5xl uppercase">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
