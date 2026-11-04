import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-vanta-black text-vanta-bone mt-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-6xl md:text-8xl leading-none text-vanta-white">VANTA<span className="text-vanta-red">.</span></p>
          <p className="mt-6 max-w-md text-sm leading-relaxed">
            Marca fictícia de streetwear conceitual. Esta é uma demonstração de e-commerce e não representa um produto real.
          </p>
        </div>
        <nav aria-label="Rodapé" className="text-sm space-y-3">
          <p className="uppercase tracking-[0.2em] text-[11px] text-vanta-stone">Loja</p>
          <Link className="block hover:text-vanta-red" to="/catalogo">Catálogo</Link>
          <Link className="block hover:text-vanta-red" to="/carrinho">Sacola</Link>
          <Link className="block hover:text-vanta-red" to="/favoritos">Favoritos</Link>
        </nav>
        <div className="text-sm space-y-3">
          <p className="uppercase tracking-[0.2em] text-[11px] text-vanta-stone">Marca</p>
          <Link className="block hover:text-vanta-red" to="/sobre">Sobre & campanhas</Link>
          <Link className="block hover:text-vanta-red" to="/sobre#contato">Contato</Link>
          <p className="pt-4 text-vanta-stone text-xs">© {new Date().getFullYear()} VANTA WEAR (fictício)</p>
        </div>
      </div>
    </footer>
  );
}
