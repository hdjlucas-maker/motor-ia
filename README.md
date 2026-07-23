# 🏍️🚗 Motor IA

Consultoria por IA de manutenção preventiva e finanças para motoristas e entregadores de aplicativo (Uber, 99, InDrive, iFood, Rappi, Zé Delivery).

O Motor IA ajuda quem vive de carro ou moto a:
- Saber o **lucro líquido real** do dia (ganhos menos combustível, comida, taxas)
- Ter alertas de **manutenção preventiva** (óleo, pneus, freios, corrente, filtros) antes de quebrar na rua
- Receber **consultoria mecânica de emergência** por IA (motor esquentando, luzes do painel, ruídos)
- Gerar **relatórios financeiros** em Excel/PDF

## ✨ Funcionalidades

- **Dashboard** — resumo do dia: ganhos, gastos e lucro líquido
- **Financeiro** — lançamento de ganhos e despesas por categoria
- **Garagem** — cadastro do veículo (carro ou moto) e controle de manutenção por KM
- **Motor IA (chat)** — assistente de IA (Google Gemini) especializado em mecânica e finanças de motorista/entregador
- **Relatórios** — exportação em Excel (.xlsx) e PDF
- **Assinatura** — teste grátis de 7 dias, depois R$ 19,99/mês ou R$ 129,99/ano via InfinitePay

## 🧱 Stack

- **Front-end:** React 19 + Vite + React Router
- **Back-end:** Cloudflare Pages Functions (serverless)
- **IA:** Google Gemini API
- **Pagamentos:** Checkout Integrado da InfinitePay (Pix e cartão)
- **Armazenamento:** Cloudflare Workers KV (status de assinatura)
- **Hospedagem:** Cloudflare Pages

## 📁 Estrutura do projeto

```
motor-ia/
├── functions/api/          # Cloudflare Pages Functions (backend)
│   ├── chat.js                  # Chat com a IA (Gemini)
│   ├── create-checkout.js       # Gera link de pagamento na InfinitePay
│   ├── payment-webhook.js       # Confirma pagamento e libera assinatura
│   └── subscription-status.js   # Consulta status de teste/assinatura
├── src/
│   ├── ai/                 # Lógica de chamada à IA no front-end
│   ├── components/          # Layout, navegação, modais, guard de assinatura
│   ├── context/             # Estado global (usuário, veículo, finanças)
│   ├── hooks/                # Hooks customizados (ex: useSubscription)
│   └── pages/                # Telas: Dashboard, Garage, Financial, AI, Reports, Subscription, Auth
├── wrangler.jsonc            # Configuração do Cloudflare Pages/Workers
└── vite.config.js
```

## ⚙️ Rodando localmente

```bash
npm install
npm run dev
```

Para testar as Functions localmente (chat, checkout, webhook), use o Wrangler:

```bash
npx wrangler pages dev dist --kv=SUBSCRIPTIONS
```

## 🔑 Variáveis de ambiente

Configuradas no painel da Cloudflare (Workers & Pages → motor-ia → Settings → Variables and secrets):

| Variável | Descrição |
|---|---|
| `GEMINI_API_KEY` | Chave da API do Google Gemini (tipo Secret) |
| `INFINITEPAY_HANDLE` | Sua InfiniteTag, sem o `$` (ex: `servicoslucas`) |
| `APP_BASE_URL` | URL de produção do app (ex: `https://motor-ia.pages.dev`) |

E o binding de KV:

| Binding | Uso |
|---|---|
| `SUBSCRIPTIONS` | Armazena o status de teste/assinatura de cada usuário |

## 🚀 Deploy

O projeto é uma **Cloudflare Pages** com **Pages Functions** (não é um Worker puro — a pasta `functions/` só é reconhecida pelo sistema de deploy do Pages).

```bash
npm run build
npx wrangler pages deploy dist
```

## 💳 Assinatura

- Todo novo usuário começa com **7 dias de teste grátis**, controlado via KV (`sub:{userId}`)
- Ao expirar, o acesso às telas do app é bloqueado e o usuário é redirecionado para `/subscription`
- Os planos (mensal e anual) são criados dinamicamente via API da InfinitePay a cada clique — não há nada fixo configurado no painel deles
- O webhook de pagamento reconfirma a transação diretamente com a API da InfinitePay antes de liberar o acesso, como camada extra de segurança

---

Desenvolvido por [Lucas.dev](https://lucascorrea-portfolio.vercel.app/)
