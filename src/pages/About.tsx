import { useState, type FormEvent } from 'react';
import Reveal from '../components/Reveal';

const campaigns = [
  { title: 'Ruína', season: 'Outono 26', style: 'linear-gradient(140deg,#7a0f1c,#0a0a0a)', text: 'Peças para depois do colapso.' },
  { title: 'Arquivo', season: 'Verão 26', style: 'linear-gradient(200deg,#d8d3ca,#8a847b)', text: 'Uniformes de trabalho reinterpretados.' },
  { title: 'Fuligem', season: 'Inverno 25', style: 'linear-gradient(90deg,#3a3733,#141414)', text: 'Tingimentos que mostram o tempo.' },
];

export default function About() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg = String(data.get('mensagem') ?? '').trim();
    if (msg.length < 10) {
      setErr('Escreva pelo menos 10 caracteres.');
      return;
    }
    // Simulação: nada é enviado a nenhum servidor.
    setErr(null);
    setSent(true);
    e.currentTarget.reset();
  };

  return (
    <div>
      <section className="mx-auto max-w-[1600px] px-4 md:px-8 pt-24 pb-32">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.4em] text-vanta-stone">Sobre a VANTA WEAR</p>
          <h1 className="mt-6 font-display uppercase text-[clamp(4.5rem,16vw,18rem)] leading-[0.8]">
            Roupa<br /><span className="text-vanta-red ml-[15%]">como</span><br />estrutura
          </h1>
        </Reveal>
        <div className="grid md:grid-cols-12 gap-8 mt-20">
          <p className="md:col-span-6 md:col-start-7 text-xl leading-relaxed">
            VANTA WEAR é uma marca fictícia criada para demonstrar uma experiência de moda editorial. Acreditamos em modelagem pesada, cores que não pedem licença e acabamentos que deixam a construção à vista.
          </p>
        </div>
      </section>

      <section id="campanhas" aria-labelledby="campanhas-titulo" className="bg-vanta-black text-vanta-white py-32">
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <h2 id="campanhas-titulo" className="font-display uppercase text-[clamp(3.5rem,10vw,9rem)] leading-none mb-16">Campanhas</h2>
          <div className="space-y-6">
            {campaigns.map((c, i) => (
              <Reveal key={c.title}>
                <article className={`grid md:grid-cols-12 gap-6 items-end border-t border-vanta-white/20 py-10 ${i % 2 ? 'md:text-right' : ''}`}>
                  <div className={`md:col-span-5 aspect-[16/9] ${i % 2 ? 'md:col-start-8 md:order-2' : ''}`} style={{ background: c.style }} aria-hidden="true" />
                  <div className={`md:col-span-6 ${i % 2 ? 'md:col-start-1 md:order-1' : 'md:col-start-7'}`}>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-vanta-stone">{c.season}</p>
                    <h3 className="font-display uppercase text-[clamp(3rem,8vw,7rem)] leading-none mt-2">{c.title}</h3>
                    <p className="mt-4 text-vanta-bone">{c.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="contato" aria-labelledby="contato-titulo" className="mx-auto max-w-[1000px] px-4 md:px-8 py-32">
        <h2 id="contato-titulo" className="font-display uppercase text-[clamp(3.5rem,10vw,9rem)] leading-none">Contato</h2>
        <p className="mt-6 text-vanta-stone">Formulário demonstrativo. Nenhuma mensagem é enviada.</p>

        {sent ? (
          <p role="status" className="mt-12 border border-vanta-black p-8 text-lg">Mensagem simulada registrada localmente. Obrigado por visitar a demonstração.</p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-12 space-y-8">
            <div>
              <label htmlFor="nome-contato" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">Nome</label>
              <input id="nome-contato" name="nome" required autoComplete="name" className="mt-2 w-full bg-transparent border-b border-vanta-black/30 focus:border-vanta-red outline-none py-2" />
            </div>
            <div>
              <label htmlFor="mensagem" className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">Mensagem</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={5}
                aria-invalid={!!err}
                aria-describedby={err ? 'mensagem-erro' : undefined}
                className="mt-2 w-full bg-transparent border-b border-vanta-black/30 focus:border-vanta-red outline-none py-2 resize-y"
              />
              {err && <p id="mensagem-erro" role="alert" className="mt-1 text-sm text-vanta-red">{err}</p>}
            </div>
            <button type="submit" className="h-14 px-10 bg-vanta-black text-vanta-white text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red">Enviar (simulado)</button>
          </form>
        )}
      </section>
    </div>
  );
}
