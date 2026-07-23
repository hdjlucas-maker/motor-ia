/**
 * Motor IA Assistant Engine - Frontend Client & Serverless Backend Integration
 */
import { FAQ_ITEMS, searchFAQ } from './knowledgeBase';

export async function processQuery({ userQuery, transactions = [], currentKm = 0, maintenances = [] }) {
  // 1. Tenta chamar o Backend Serverless (Vercel API /api/chat)
  try {
    const apiResponse = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userQuery,
        transactions,
        currentKm,
        maintenances
      })
    });

    if (apiResponse.ok) {
      const data = await apiResponse.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch (err) {
    console.warn('Backend Serverless indisponível localmente, executando engine local inteligente:', err);
  }

  // 2. Fallback Inteligente Local
  return processLocalAI({ userQuery, transactions, currentKm, maintenances });
}

function processLocalAI({ userQuery, transactions, currentKm, maintenances }) {
  const q = userQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = (transactions || []).filter(t => t.date === todayStr);

  const todayGross = todayTransactions.filter(t => t.type === 'ganho').reduce((a, b) => a + Number(b.amount), 0);
  const todayExpenses = todayTransactions.filter(t => t.type === 'gasto').reduce((a, b) => a + Number(b.amount), 0);
  const todayNet = todayGross - todayExpenses;

  const overdueParts = (maintenances || []).filter(m => (m.lastKm + m.intervalKm) < currentKm);

  // 1. Intenção Prioritária: Para que serve o app / Como ele ajuda o motorista
  if (
    q.includes('serve pra que') || 
    q.includes('para que serve') || 
    q.includes('pra que serve') || 
    q.includes('ajuda em que') || 
    q.includes('o que faz') || 
    q.includes('o que e esse app') || 
    q.includes('o que e o app') || 
    q.includes('ajudar o motorista') || 
    q.includes('utilidade') || 
    q.includes('funciona como') || 
    q.includes('por que usar') ||
    q.includes('como ajuda')
  ) {
    return `🚗 **O Motor IA é o seu parceiro digital de trabalho para lucrar mais e não ficar na mão!**\n\n` +
           `Ele foi criado especialmente para você que roda em aplicativo (Uber, 99, iFood, Rappi, InDrive, entregas) para cuidar do seu instrumento de trabalho: **seu veículo (carro ou moto) e o dinheiro do seu bolso.**\n\n` +
           `---\n\n` +
           `### 💡 **Como o Motor IA ajuda você no dia a dia:**\n\n` +
           `1. 💰 **Lucro Líquido Real (Dinheiro de Verdade):**\n` +
           `   • O app desconta seus custos de combustível, alimentação e taxas do faturamento bruto da Uber/99.\n` +
           `   • Você descobre na hora quanto REALMENTE sobrou no seu bolso sem se enganar!\n\n` +
           `2. 🛠️ **Garagem Preventiva (Evita Quebrar na Rua):**\n` +
           `   • Acompanha seu odômetro (**${currentKm.toLocaleString('pt-BR')} KM**) e te avisa ANTES de vencerem o **óleo, filtros, pneus, freios ou corrente da moto**.\n` +
           `   • Evita prejuízos gigantes de motor fundido ou ficar parado na pista esperando guincho.\n\n` +
           `3. 💵 **Reserva Financeira por KM (Caixinha de Peças):**\n` +
           `   • Calcula exatamente quanto guardar por KM rodado (ex: R$ 0,20/km para carro; R$ 0,10/km para moto) para pagar revisões sem sufoco no cartão.\n\n` +
           `4. 🚨 **Socorro & Consultoria Mecânica na Rua:**\n` +
           `   • Se o motor esquentar, sair fumaça, o carro falhar ou acender luz no painel, a IA te orienta na hora sobre o que fazer com segurança.\n\n` +
           `5. 📊 **Relatórios em Excel e PDF:**\n` +
           `   • Exporte planilhas completas dos seus ganhos e custos para ter controle financeiro total.\n\n` +
           `---\n\n` +
           `👉 **Por onde começar:**\n` +
           `• **Aba Finanças:** Lance seus ganhos e abastecimentos do dia.\n` +
           `• **Aba Garagem:** Atualize a quilometragem do seu odômetro.\n` +
           `• **Aba Motor IA:** Tire qualquer dúvida sobre manutenção ou finanças!`;
  }

  // Busca na base de FAQ
  const matchingFaq = searchFAQ(userQuery);
  if (matchingFaq.length > 0) {
    return matchingFaq[0].answer;
  }

  // Emergências
  if (q.includes('esquentando') || q.includes('fumaca') || q.includes('ferveu') || q.includes('luz vermelha') || q.includes('luz da injecao')) {
    return `🚨 **EMERGÊNCIA NO VEÍCULO:**\n\n` +
           `1. **Pare imediatamente em local seguro** e desligue o motor.\n` +
           `2. **Ligue o pisca-alerta** e coloque o triângulo.\n` +
           `3. **NUNCA abra o reservatório ou radiador quente** (risco de queimadura por água pressurizada).\n` +
           `4. Se for a **luz vermelha do óleo**, não dê partida sob hipótese alguma. Mande guinchar para a oficina!`;
  }

  // Saudações
  if (q.includes('oi') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
    return `Olá! Sou a Motor IA, sua consultora pessoal de faturamento, manutenção de veículos e suporte ao aplicativo.\n\n` +
           `Estou conectada aos seus dados em tempo real. Como posso te ajudar agora?`;
  }

  // Ganhos
  if (q.includes('hoje') || q.includes('ganhei') || q.includes('lucro') || q.includes('faturei') || q.includes('quanto fiz')) {
    if (todayTransactions.length === 0) {
      return `Você ainda não lançou nenhuma movimentação hoje (${new Date().toLocaleDateString('pt-BR')}).\n\n💡 Toque na aba **Finanças** para registrar seus ganhos ou abastecimentos!`;
    }
    return `📊 **Resumo de Hoje:**\n\n` +
           `• Faturamento Bruto: R$ ${todayGross.toFixed(2)}\n` +
           `• Despesas: R$ ${todayExpenses.toFixed(2)}\n` +
           `• **LUCRO LÍQUIDO REAL: R$ ${todayNet.toFixed(2)}**`;
  }

  // Garagem
  if (q.includes('garagem') || q.includes('peca') || q.includes('oleo') || q.includes('pneu') || q.includes('freio') || q.includes('vencid') || q.includes('revis')) {
    if (overdueParts.length > 0) {
      return `🚨 **ATENÇÃO: Peças VENCIDAS!**\n` +
             overdueParts.map(p => `• **${p.name}**: Passou ${(currentKm - (p.lastKm + p.intervalKm)).toLocaleString('pt-BR')} KM da troca.`).join('\n');
    }
    return `✅ **Sua garagem está 100% em dia!** Odômetro atual: **${currentKm.toLocaleString('pt-BR')} KM**.`;
  }

  // Fora do escopo
  const offTopicKeywords = ['pao', 'bolo', 'futebol', 'jogo', 'politica', 'medicina', 'filme', 'musica', 'piada'];
  if (offTopicKeywords.some(kw => q.includes(kw))) {
    return "Posso ajudar apenas com assuntos relacionados ao Motor IA, finanças e manutenção do seu veículo de aplicativo. Se tiver dúvidas sobre faturamento, peças ou suporte, pode perguntar!";
  }

  // Resposta Padrão
  return `Como sua consultora Motor IA, estou aqui para te ajudar no dia a dia do seu aplicativo!\n\n` +
         `📊 **Seus dados atuais:**\n` +
         `• Lucro Líquido Hoje: **R$ ${todayNet.toFixed(2)}**\n` +
         `• Odômetro: **${currentKm.toLocaleString('pt-BR')} KM**\n` +
         (overdueParts.length > 0 ? `• 🚨 **${overdueParts.length} peça(s) vencida(s)** na Garagem.\n\n` : `• ✅ Manutenções em dia.\n\n`) +
         `Pode me perguntar para que serve o app, sobre seu faturamento, manutenção de carro ou moto ou emergências!`;
}
