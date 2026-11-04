import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../store/cart';
import { products } from '../data/products';
import { formatBRL } from '../types';

interface Fields {
  nome: string;
  email: string;
  cep: string;
  endereco: string;
  cidade: string;
  envio: 'padrao' | 'expresso';
}

const initial: Fields = { nome: '', email: '', cep: '', endereco: '', cidade: '', envio: 'padrao' };
const SHIPPING = { padrao: 2490, expresso: 4990 } as const;

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Informe um e-mail válido.';
  if (!/^\d{5}-?\d{3}$/.test(f.cep)) e.cep = 'CEP no formato 00000-000.';
  if (f.endereco.trim().length < 5) e.endereco = 'Informe endereço e número.';
  if (f.cidade.trim().length < 2) e.cidade = 'Informe a cidade.';
  return e;
}

export default function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const [fields, setFields] = useState<Fields>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [done, setDone] = useState<string | null>(null);

  const shipping = SHIPPING[fields.envio];
  const total = subtotal + (lines.length ? shipping : 0);

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    // Simulação: nenhum dado é enviado. Os campos existem apenas em memória nesta página.
    const code = `VW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setDone(code);
    clear();
    setFields(initial);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-[900px] px-4 md:px-8 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-vanta-red">Simulação concluída</p>
        <h1 className="mt-4 font-display uppercase text-[clamp(4rem,12vw,10rem)] leading-none">Pedido<br />simulado</h1>
        <p className="mt-8 text-vanta-stone">Código fictício: <strong className="text-vanta-black">{done}</strong>. Nenhum pagamento foi processado e nenhum dado foi enviado.</p>
        <Link to="/catalogo" className="inline-block mt-12 bg-vanta-black text-vanta-white px-8 py-4 text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red">Continuar comprando</Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-[900px] px-4 md:px-8 py-32 text-center">
        <h1 className="font-display uppercase text-6xl">Sacola vazia</h1>
        <Link to="/catalogo" className="inline-block mt-8 underline underline-offset-4">Voltar ao catálogo</Link>
      </div>
    );
  }

  const field = (id: keyof Fields, label: string, type = 'text', extra: Record<string, string> = {}) => (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.25em] text-vanta-stone">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={fields[id] as string}
        onChange={(e) => update(id, e.target.value as Fields[typeof id])}
        aria-invalid={!!errors[id]}
        aria-describedby={errors[id] ? `${id}-erro` : undefined}
        className="mt-2 w-full bg-transparent border-b border-vanta-black/30 focus:border-vanta-red outline-none py-2"
        {...extra}
      />
      {errors[id] && <p id={`${id}-erro`} role="alert" className="mt-1 text-sm text-vanta-red">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16">
      <div role="note" className="border-2 border-vanta-red text-vanta-red p-4 mb-12 text-sm">
        <strong className="uppercase tracking-[0.15em]">Checkout demonstrativo.</strong> Esta página não coleta dados de pagamento, não processa cobranças e não envia pedidos. Os dados digitados ficam apenas nesta tela.
      </div>

      <h1 className="font-display uppercase text-[clamp(4rem,10vw,9rem)] leading-[0.85] mb-12">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-12">
        <form onSubmit={onSubmit} noValidate className="lg:col-span-7 space-y-10" aria-label="Dados de entrega">
          <fieldset className="space-y-6">
            <legend className="font-display uppercase text-3xl mb-4">01 · Contato</legend>
            {field('nome', 'Nome completo', 'text', { autoComplete: 'name' })}
            {field('email', 'E-mail', 'email', { autoComplete: 'email' })}
          </fieldset>

          <fieldset className="space-y-6">
            <legend className="font-display uppercase text-3xl mb-4">02 · Entrega</legend>
            <div className="grid md:grid-cols-2 gap-6">
              {field('cep', 'CEP', 'text', { inputMode: 'numeric', autoComplete: 'postal-code', placeholder: '00000-000' })}
              {field('cidade', 'Cidade', 'text', { autoComplete: 'address-level2' })}
            </div>
            {field('endereco', 'Endereço e número', 'text', { autoComplete: 'street-address' })}
          </fieldset>

          <fieldset>
            <legend className="font-display uppercase text-3xl mb-4">03 · Envio</legend>
            {(['padrao', 'expresso'] as const).map((opt) => (
              <label key={opt} className="flex justify-between items-center border border-vanta-black/20 p-4 mb-3 cursor-pointer has-[:checked]:border-vanta-red">
                <span className="flex items-center gap-3">
                  <input type="radio" name="envio" checked={fields.envio === opt} onChange={() => update('envio', opt)} className="accent-[#7a0f1c]" />
                  {opt === 'padrao' ? 'Padrão (simulado, 5 a 8 dias)' : 'Expresso (simulado, 2 a 3 dias)'}
                </span>
                <span className="tabular-nums">{formatBRL(SHIPPING[opt])}</span>
              </label>
            ))}
          </fieldset>

          <button type="submit" className="w-full h-16 bg-vanta-black text-vanta-white text-[12px] uppercase tracking-[0.25em] hover:bg-vanta-red transition-colors">
            Finalizar pedido simulado
          </button>
          <p className="text-xs text-vanta-stone">Pagamento: indisponível nesta demonstração. Integração real necessária (ver README, seção “Para produção”).</p>
        </form>

        <aside aria-labelledby="pedido" className="lg:col-span-5 bg-vanta-ink text-vanta-white p-8 lg:sticky lg:top-28 lg:self-start">
          <h2 id="pedido" className="text-[11px] uppercase tracking-[0.3em] text-vanta-bone">Seu pedido</h2>
          <ul className="mt-6 space-y-4 text-sm">
            {lines.map((l) => {
              const product = products.find((p) => p.id === l.productId);
              return (
                <li key={l.key} className="flex justify-between gap-4">
                  <span>{product?.name} · {l.color} · {l.size} × {l.qty}</span>
                  <span className="tabular-nums">{formatBRL((product?.price ?? 0) * l.qty)}</span>
                </li>
              );
            })}
          </ul>
          <dl className="mt-6 pt-6 border-t border-vanta-white/20 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatBRL(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Envio</dt><dd className="tabular-nums">{formatBRL(shipping)}</dd></div>
          </dl>
          <div className="mt-6 pt-6 border-t border-vanta-white/20 flex justify-between items-baseline">
            <span className="uppercase tracking-[0.2em] text-sm">Total</span>
            <span className="font-display text-4xl tabular-nums">{formatBRL(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
