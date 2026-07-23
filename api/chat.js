export default async function handler(req, res) {
  // Cabeçalhos CORS para permitir chamadas do frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = req.body || {};
    const { userQuery, transactions = [], currentKm = 0, maintenances = [] } = body;

    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return res.status(200).json({ 
        reply: "Olá! Como posso ajudar você hoje no seu dia a dia de motorista?" 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.AI_API_KEY;

    // Métricas para passar no prompt
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTransactions = (transactions || []).filter(t => t.date === todayStr);

    const todayGross = todayTransactions.filter(t => t.type === 'ganho').reduce((a, b) => a + Number(b.amount), 0);
    const todayExpenses = todayTransactions.filter(t => t.type === 'gasto').reduce((a, b) => a + Number(b.amount), 0);
    const todayNet = todayGross - todayExpenses;

    const overdue = (maintenances || []).filter(m => (m.lastKm + m.intervalKm) < currentKm);
    const urgent = (maintenances || []).filter(m => {
      const rem = (m.lastKm + m.intervalKm) - currentKm;
      return rem >= 0 && rem <= 1000;
    });

    // Se houver chave API no Vercel (GEMINI_API_KEY)
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemPrompt = `
Você é a Motor IA, a mais inteligente assistente consultora financeira, operacional e mecânica para motoristas de aplicativo (Uber, 99, Indrive).
Seu objetivo é ajudar o motorista a lucrar mais, economizar combustível, prevenir quebras de carro e organizar suas contas.

Diretrizes:
- Responda em Português do Brasil com tom profissional, motivador, humano e prático.
- Use negrito (**texto**) e tópicos com marcadores quando ajudar a leitura.
- Se a pergunta for totalmente fora do escopo de trabalho do motorista (ex: receitas de bolo, futebol, política, medicina), responda educadamente que seu foco é exclusivo na rotina e finanças do motorista de aplicativo.
- Responda qualquer dúvida sobre o app, estratégias de horário, economia de combustível, cálculo de reserva, imposto, manutenção de óleo/pneus e finanças com extrema precisão!

TELEMETRIA ATUAL DO MOTORISTA:
- Data Hoje: ${todayStr}
- Faturamento Bruto Hoje: R$ ${todayGross.toFixed(2)}
- Despesas Hoje: R$ ${todayExpenses.toFixed(2)}
- Lucro Líquido Real Hoje: R$ ${todayNet.toFixed(2)}
- Odômetro Atual do Veículo: ${currentKm.toLocaleString('pt-BR')} KM
- Peças Vencidas: ${overdue.map(p => p.name).join(', ') || 'Nenhuma'}
- Peças Próximas de Trocar: ${urgent.map(p => p.name).join(', ') || 'Nenhuma'}
        `;

        // Tenta endpoint da Gemini API (1.5 Flash)
        const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
        
        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
            const apiResponse = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + `\n\nPERGUNTA DO MOTORISTA: "${userQuery}"` }] }]
              })
            });

            if (apiResponse.ok) {
              const data = await apiResponse.json();
              const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply && reply.trim()) {
                return res.status(200).json({ reply: reply.trim() });
              }
            }
          } catch (modelErr) {
            console.warn(`Tentativa com modelo ${model} falhou:`, modelErr);
          }
        }
      } catch (geminiErr) {
        console.warn('Erro ao chamar Gemini API no Vercel:', geminiErr);
      }
    }

    // Engine Local Serverless (Fallback de alta precisão)
    const reply = generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent });
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro na API Serverless:', error);
    return res.status(200).json({ 
      reply: "Sou a Motor IA! Estou pronta para te ajudar com seu faturamento, lucros e manutenção do veículo. Pode me fazer uma pergunta sobre seu dia de trabalho!" 
    });
  }
}

function generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent }) {
  const q = userQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Out of scope
  const offTopicKeywords = ['pao', 'bolo', 'futebol', 'jogo', 'politica', 'medicina', 'filme', 'musica', 'piada', 'namorad'];
  if (offTopicKeywords.some(kw => q.includes(kw))) {
    return "Posso ajudar apenas com assuntos relacionados ao Motor IA e ao seu trabalho como motorista de aplicativo. Se tiver dúvidas sobre faturamento, abastecimento ou manutenção do seu carro, pode perguntar!";
  }

  // O que faz o app / ajuda em que
  if (q.includes('ajuda em que') || q.includes('pra que serve') || q.includes('o que faz') || q.includes('funciona') || q.includes('utilidade') || q.includes('servico')) {
    return `🚗 **O Motor IA é o seu copiloto financeiro e mecânico completo!**\n\n` +
           `Ele ajuda você em 4 pilares principais:\n\n` +
           `1. **Lucro Líquido Real:** Calcula exatamente quanto sobrou no bolso descontando combustível, alimentação e taxas.\n` +
           `2. **Garagem & Peças:** Acompanha a quilometragem do seu carro (**${currentKm.toLocaleString('pt-BR')} KM**) e te avisa ANTES do óleo, pneus e freios vencerem.\n` +
           `3. **Consultoria Financeira:** Responde suas dúvidas sobre estratégias de horário, economia de combustível e custo por KM.\n` +
           `4. **Relatórios Excel & PDF:** Baixa planilhas dos seus lançamentos na aba **Relatórios**.\n\n` +
           `💡 Cadastre seus ganhos da Uber/99 na aba **Finanças** para ver todos os seus números em tempo real!`;
  }

  // Ganhos
  if (q.includes('hoje') || q.includes('ganhei') || q.includes('lucro') || q.includes('faturei') || q.includes('quanto fiz') || q.includes('resultado')) {
    return `📊 **Resumo de Hoje:**\n\n` +
           `• Faturamento Bruto: R$ ${todayGross.toFixed(2)}\n` +
           `• Despesas: R$ ${todayExpenses.toFixed(2)}\n` +
           `• **LUCRO LÍQUIDO REAL: R$ ${todayNet.toFixed(2)}**\n\n` +
           (todayNet > 0 ? "🔥 Dia positivo! Mantenha a disciplina nos gastos." : "💡 Registre seus lançamentos na aba Finanças para ver o calculo atualizado!");
  }

  // Garagem
  if (q.includes('garagem') || q.includes('peca') || q.includes('oleo') || q.includes('pneu') || q.includes('freio') || q.includes('vencid') || q.includes('revis')) {
    if (overdue.length > 0) {
      return `🚨 **ATENÇÃO: Peças VENCIDAS!**\n` +
             overdue.map(p => `• **${p.name}**: Passou ${(currentKm - (p.lastKm + p.intervalKm)).toLocaleString('pt-BR')} KM da troca.`).join('\n');
    }
    return `✅ **Sua garagem está 100% em dia!** Odômetro atual: **${currentKm.toLocaleString('pt-BR')} KM**.`;
  }

  // Saudações
  if (q.includes('oi') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
    return `Olá! Sou a Motor IA, sua consultora pessoal de faturamento e manutenção.\n\n` +
           `Estou conectada aos seus dados em tempo real. Como posso te ajudar agora?`;
  }

  // Resposta Padrão
  return `Como sua consultora Motor IA, estou aqui para te ajudar no dia a dia do seu aplicativo!\n\n` +
         `📊 **Seus dados no momento:**\n` +
         `• Lucro Líquido Hoje: **R$ ${todayNet.toFixed(2)}**\n` +
         `• Odômetro: **${currentKm.toLocaleString('pt-BR')} KM**\n` +
         (overdue.length > 0 ? `• 🚨 **${overdue.length} peça(s) vencida(s)** na Garagem.\n\n` : `• ✅ Manutenções em dia.\n\n`) +
         `Pode me perguntar sobre seu faturamento, custos por KM, despesas de combustível ou como usar o app!`;
}
