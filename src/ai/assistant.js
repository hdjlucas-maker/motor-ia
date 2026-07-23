/**
 * Motor IA Assistant Engine - Frontend Client & Serverless Backend Integration
 */

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
  const urgentParts = (maintenances || []).filter(m => {
    const rem = (m.lastKm + m.intervalKm) - currentKm;
    return rem >= 0 && rem <= 1000;
  });

  // O que faz / Para que serve o app
  if (q.includes('ajuda em que') || q.includes('pra que serve') || q.includes('o que faz') || q.includes('funciona') || q.includes('utilidade')) {
    return `🚗 **O Motor IA é o seu assistente financeiro e mecânico completo!**\n\n` +
           `Ele ajuda você em 4 pilares principais:\n\n` +
           `1. **Lucro Líquido Real:** Mostra exatamente quanto sobrou no bolso descontando combustível, alimentação e taxas.\n` +
           `2. **Garagem & Peças:** Acompanha a quilometragem do seu carro (**${currentKm.toLocaleString('pt-BR')} KM**) e te avisa ANTES do óleo, pneus e freios vencerem.\n` +
           `3. **Consultoria Financeira:** Responde suas dúvidas sobre estratégias de horário, economia de combustível e custo por KM.\n` +
           `4. **Relatórios Excel & PDF:** Permite exportar todos os seus dados em planilhas completas na aba **Relatórios**.\n\n` +
           `💡 Cadastre seus ganhos e abastecimentos na aba **Finanças** para ver todos os seus números em tempo real!`;
  }

  // Saudações
  if (q.includes('oi') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
    return `Olá! Sou a Motor IA, sua consultora pessoal de faturamento e manutenção.\n\n` +
           `Estou conectada aos seus dados em tempo real. Pode me perguntar quanto você lucrou hoje, se o óleo está vencido ou para que serve o aplicativo!`;
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
    return "Posso ajudar apenas com assuntos relacionados ao Motor IA e ao seu trabalho como motorista de aplicativo. Se tiver dúvidas sobre faturamento, abastecimento ou manutenção do seu carro, pode perguntar!";
  }

  // Resposta Padrão
  return `Como sua consultora Motor IA, estou aqui para te ajudar no dia a dia do seu aplicativo!\n\n` +
         `📊 **Seus dados atuais:**\n` +
         `• Lucro Líquido Hoje: **R$ ${todayNet.toFixed(2)}**\n` +
         `• Odômetro: **${currentKm.toLocaleString('pt-BR')} KM**\n` +
         (overdueParts.length > 0 ? `• 🚨 **${overdueParts.length} peça(s) vencida(s)** na Garagem.\n\n` : `• ✅ Manutenções em dia.\n\n`) +
         `Pode me perguntar sobre seu faturamento, custos por KM, despesas de combustível ou como usar o app!`;
}
