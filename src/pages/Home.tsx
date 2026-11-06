import campaignPhoto from './campaign.jpg';
import { Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';

export default function Home() {
  const featured = products.filter((p) => p.campaign === 'Coleção Ruína');
  const newIn = products.filter((p) => p.isNew);

  return (
    <div>
      {/* HERO */}
      <section aria-labelledby="hero-title" className="relative min-h-[88vh] overflow-hidden bg-vanta-black text-vanta-white">
        <div
          className="absolute inset-0 opacity-90 motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate]"
          style={{ background: 'radial-gradient(60% 60% at 70% 30%,#a3141f 0%,#7a0f1c 25%,#0a0a0a 70%)' }}
          aria-hidden="true"
        />
        <img src={campaignPhoto} alt="" fetchPriority="high" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center] opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-vanta-black via-transparent to-vanta-black/30" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 12%)' }} aria-hidden="true" />
        <div className="relative mx-auto max-w-[1600px] px-4 md:px-8 pt-24 md:pt-40 pb-16 grid md:grid-cols-12 gap-6">
          <Reveal className="md:col-span-12">
            <p className="text-[11px] uppercase tracking-[0.4em] text-vanta-bone">Coleção 07 · Ruína</p>
          </Reveal>
          <h1 id="hero-title" className="md:col-span-12 font-display uppercase leading-[0.82] text-[clamp(5rem,20vw,22rem)] -ml-1">
            <span className="block">Vanta</span>
            <span className="block md:ml-[18%] text-vanta-red">Ruína</span>
          </h1>
          <div className="md:col-span-5 md:col-start-8 mt-8">
            <p className="text-lg leading-relaxed text-vanta-bone max-w-md">
              Peças pensadas para o que sobra depois do colapso: modelagem pesada, cor que não pede desculpas e costuras à vista.
            </p>
            <div className="mt-10 flex gap-4">
              <Link to="/catalogo" className="bg-vanta-white text-vanta-black px-7 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red hover:text-vanta-white transition-colors">
                Comprar coleção
              </Link>
              <Link to="/sobre" className="border border-vanta-white px-7 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-white hover:text-vanta-black transition-colors">
                Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* COLEÇÃO EM DESTAQUE */}
      <section aria-labelledby="destaque" className="mx-auto max-w-[1600px] px-4 md:px-8 py-32">
        <div className="flex items-end justify-between mb-16 gap-8">
          <h2 id="destaque" className="font-display uppercase text-[clamp(3.5rem,11vw,10rem)] leading-[0.85]">
            Em<br /><span className="ml-[12%]">destaque</span>
          </h2>
          <Link to="/catalogo" className="hidden md:inline text-[12px] uppercase tracking-[0.25em] border-b border-vanta-black pb-1 hover:text-vanta-red hover:border-vanta-red">
            Ver catálogo completo
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* CAMPANHA FULL-SCREEN */}
      <section aria-labelledby="campanha" className="relative min-h-screen bg-vanta-red text-vanta-white overflow-hidden flex items-center">
        <div className="absolute -right-10 top-10 font-display text-[28vw] leading-none text-black/20 select-none" aria-hidden="true">
          NÃO
        </div>
        <div className="relative mx-auto max-w-[1600px] w-full px-4 md:px-8 grid md:grid-cols-12 gap-8">
          <Reveal className="md:col-span-7">
            <p className="text-[11px] uppercase tracking-[0.4em] text-vanta-bone">Campanha · Sem permissão</p>
            <h2 id="campanha" className="mt-6 font-display uppercase text-[clamp(4rem,14vw,14rem)] leading-[0.82]">
              Sem<br />pedir<br />licença
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9 self-end">
            <p className="text-lg leading-relaxed">
              Filmada em armazéns abandonados e estúdios sem luz natural. Uma série de imagens sobre roupas que não se desculpam por ocupar espaço.
            </p>
            <Link to="/sobre#campanhas" className="inline-block mt-8 text-[12px] uppercase tracking-[0.25em] border-b border-vanta-white pb-1">
              Ver campanhas
            </Link>
          </Reveal>
        </div>
      </section>

      {/* NOVIDADES */}
      <section aria-labelledby="novidades" className="mx-auto max-w-[1600px] px-4 md:px-8 py-32">
        <h2 id="novidades" className="font-display uppercase text-[clamp(3rem,8vw,7rem)] leading-none mb-16">Novidades</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newIn.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* ESTRUTURA DE NAVEGAÇÃO EDITORIAL */}
      <section aria-label="Categorias" className="border-y border-vanta-black/15">
        <ul className="mx-auto max-w-[1600px] px-4 md:px-8 grid grid-cols-2 md:grid-cols-4">
          {[
            ['Camisetas', 'camisetas'],
            ['Moletons', 'moletons'],
            ['Calças', 'calcas'],
            ['Acessórios', 'acessorios'],
          ].map(([label, cat]) => (
            <li key={cat} className="border-l border-vanta-black/15 first:border-l-0">
              <Link to={`/catalogo?categoria=${cat}`} className="group block py-14 px-4 md:px-8">
                <span className="font-display uppercase text-5xl md:text-7xl group-hover:text-vanta-red transition-colors">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
