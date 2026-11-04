# VANTA WEAR

Marca **fictícia** de streetwear conceitual. Site comercial com experiência editorial e uma **loja demonstrativa** construída em React + TypeScript + Vite + Tailwind CSS, com GSAP em animações pontuais.

> Nenhum pagamento é processado. Nenhum dado é enviado a servidores. Produtos, preços, estoques, fotos e campanhas são ilustrativos.

## Stack

- React 18, TypeScript (strict), Vite 5
- React Router 6
- Tailwind CSS 3
- GSAP (somente na revelação de blocos e em nada além disso)
- Estado: `CartProvider` e `FavoritesProvider` com `useReducer`/`useState`, persistidos em `localStorage` com proteção contra falhas

## Como executar

Requisitos: Node.js 20 ou superior.

```bash
npm install        # gera/usa o package-lock.json
npm run dev        # http://localhost:5173
npm run build      # typecheck + build de produção em dist/
npm run preview    # serve o build localmente
```

## Estrutura

```
src/
  App.tsx                 rotas, layout e scroll ao trocar de página
  main.tsx                providers e montagem
  types.ts                tipos de domínio e formatação de moeda
  data/products.ts        catálogo DEMONSTRATIVO (preço, variantes, estoque)
  store/cart.tsx          carrinho: adicionar, alterar quantidade, remover, subtotal, validação
  store/favorites.tsx     favoritos persistidos
  lib/motion.ts           detecção de prefers-reduced-motion
  components/             Header, Footer, ProductCard, Reveal, SimulationBanner
  pages/                  Home, Catalog, Product, Cart, Checkout, About, Favorites, NotFound
```

Para trocar o catálogo, edite apenas `src/data/products.ts`. Estoque é por variante, com a chave `"Cor|Tamanho"`.

## Funcionalidades

- **Home:** hero com movimento sutil de fundo, coleção em destaque em grid assimétrico, campanha full-screen e navegação por categoria.
- **Catálogo:** busca (também pela barra do cabeçalho, via `?q=`), categoria, faixa de preço, tamanho, somente com estoque e ordenação. Os filtros ficam na URL para busca.
- **Produto:** galeria com abas, seleção de cor e tamanho, estoque demonstrativo por variante, quantidade com validação, mensagens de erro e sucesso, favoritos e detalhes expansíveis.
- **Carrinho:** alteração de quantidade, remoção, subtotal e validação contra o estoque. Persiste entre visitas. Itens acima do estoque são descartados ao carregar.
- **Checkout demonstrativo:** identificado como simulação em destaque. Coleta nome, e-mail e endereço apenas para validação de formulário. Não há campos de cartão. Nada é enviado.
- **Sobre:** manifesto, campanhas e formulário de contato simulado.
- **Acessibilidade:** link para pular ao conteúdo, navegação por teclado, foco visível, rótulos em botões de ícone, `aria-live` nos resultados e erros anunciados com `role="alert"`.
- **Movimento:** menu mobile com tecla Esc, hover em cards e troca de imagens. Com `prefers-reduced-motion`, animações e revelações são desligadas.

## Publicar no GitHub

```bash
git init
git add .
git commit -m "feat: VANTA WEAR demo store"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/vanta-wear.git
git push -u origin main
```

O `.gitignore` já exclui `node_modules`, `dist` e `.env`.

## Hospedar na Vercel

1. Em vercel.com, clique em **Add New → Project** e importe o repositório do GitHub.
2. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
3. Em **Environment Variables**, copie as variáveis de `.env.example` apenas se for integrar algum serviço. A loja demo não precisa de nenhuma.
4. Clique em **Deploy**.

Como a aplicação usa rotas do React Router, adicione `vercel.json` na raiz para que `/produto/...` abra diretamente:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

## Para produção comercial (o que falta)

A loja **não recebe pagamentos**. Para vender de verdade, é preciso:

1. **Catálogo real:** substituir `data/products.ts` por dados vindos de Shopify (Storefront API) ou outro CMS/ERP, com preços e estoque sincronizados.
2. **Carrinho no servidor:** hoje o carrinho é local. Em produção, ele deve ser criado e validado pelo backend ou pelo checkout do provedor, para evitar preços alterados pelo cliente.
3. **Checkout de pagamento:** usar Shopify Checkout ou Stripe Checkout (ou Payment Element com backend próprio). Nunca capturar número de cartão no front-end deste projeto.
4. **Frete e impostos:** integrar cálculo de frete e tributos (ICMS, IPI quando aplicável) por CEP.
5. **Pedidos e e-mails transacionais:** webhook de confirmação de pagamento, e-mail de pedido e atualização de estoque.
6. **Formulário de contato:** conectar a um serviço real (e-mail ou CRM) com proteção anti-spam.
7. **Privacidade e termos:** política de privacidade, termos de uso, trocas e devoluções, e consentimento de cookies conforme a LGPD (Brasil) ou a lei aplicável ao público. Hoje o site não coleta dados, mas a loja real coletará.
8. **Imagens:** substituir os gradientes ilustrativos por fotografias próprias ou licenciadas, em formatos WebP/AVIF, com `alt` descritivo e `srcset`. Não usar imagens de terceiros sem licença.
9. **Analytics:** GA4, Meta Pixel ou similar, somente após consentimento.
10. **SEO técnico:** metadados por página, `sitemap.xml`, `robots.txt` e dados estruturados de produto (schema.org `Product`).
11. **Testes:** testes unitários do carrinho e da validação (Vitest), testes de ponta a ponta (Playwright) do fluxo de compra e auditoria de acessibilidade automatizada (axe).
12. **Monitoramento de erros:** Sentry ou equivalente.

## Dados e licenças

- Marca, produtos, preços, estoques, endereços e campanhas são inventados.
- Não há imagens de terceiros no repositório. As pré-visualizações são gradientes CSS.
- A fonte Anton e a Inter vêm do Google Fonts, sob licença SIL Open Font License.
