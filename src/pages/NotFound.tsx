import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[900px] px-4 md:px-8 py-40 text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-vanta-red">Erro 404</p>
      <h1 className="mt-4 font-display uppercase text-[clamp(5rem,16vw,14rem)] leading-none">Perdido</h1>
      <p className="mt-6 text-vanta-stone">A página ou o produto que você procura não existe nesta demonstração.</p>
      <Link to="/" className="inline-block mt-12 bg-vanta-black text-vanta-white px-8 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red">Voltar ao início</Link>
    </div>
  );
}
