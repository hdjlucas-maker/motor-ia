export default async function handler(req, res) {
  // Cabeçalhos CORS
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
        reply: "Olá! Sou a Motor IA. Como posso te ajudar hoje com suas finanças ou manutenção do carro?" 
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
- Responda qualquer dúvida sobre o app, passo a passo de como cadastrar ganhos/gastos, estratégias de horário, economia de combustível, cálculo de reserva, imposto, manutenção de óleo/pneus e finanças com extrema precisão!

TELEMETRIA ATUAL DO MOTORISTA:
- Data Hoje: ${todayStr}
- Faturamento Bruto Hoje: R$ ${todayGross.toFixed(2)}
- Despesas Hoje: R$ ${todayExpenses.toFixed(2)}
- Lucro Líquido Real Hoje: R$ ${todayNet.toFixed(2)}
- Odômetro Atual do Veículo: ${currentKm.toLocaleString('pt-BR')} KM
- Peças Vencidas: ${overdue.map(p => p.name).join(', ') || 'Nenhuma'}
- Peças Próximas de Trocar: ${urgent.map(p => p.name).join(', ') || 'Nenhuma'}
        `;

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

    // Engine Local Serverless de Alta Inteligência
    const reply = generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent, transactions });
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro na API Serverless:', error);
    return res.status(200).json({ 
      reply: "Sou a Motor IA! Estou pronta para te ajudar com seu faturamento, lucros e manutenção do veículo. Pode me fazer uma pergunta sobre seu dia de trabalho!" 
    });
  }
}

function generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent, transactions }) {
  const q = userQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. Fora do escopo
  const offTopicKeywords = ['pao', 'bolo', 'futebol', 'jogo', 'politica', 'medicina', 'filme', 'musica', 'piada', 'namorad', 'receita'];
  if (offTopicKeywords.some(kw => q.includes(kw))) {
    return "Posso ajudar apenas com assuntos relacionados ao Motor IA e ao seu trabalho como motorista de aplicativo. Se tiver dúvidas sobre faturamento, abastecimento ou manutenção do seu carro, pode perguntar!";
  }

  // 2. Como adicionar / cadastrar / registrar dados no app
  if (q.includes('adicion') || q.includes('cadastr') || q.includes('registr') || q.includes('lancar') || q.includes('colocar') || q.includes('inserir') || q.includes('como eu') || q.includes('como faco')) {
    return `📝 **Como Adicionar seus Dados no Motor IA (Passo a Passo):**\n\n` +
           `1. **Lançar Faturamento (Uber/99/Indrive):**\n` +
           `   Toque na aba **Finanças** no menu inferior -> selecione **"Ganho"** -> digite o valor faturado no dia -> clique em **Salvar**.\n\n` +
           `2. **Lançar Despesas (Combustível, Comida, Oficina):**\n` +
           `   Na aba **Finanças** -> selecione **"Despesa"** -> escolha a categoria (Combustível, Alimentação, Manutenção) -> coloque o valor -> clique em **Salvar**.\n\n` +
           `3. **Atualizar KM do Carro & Peças:**\n` +
           `   Toque na aba **Garagem** -> digite a quilometragem atual do seu odômetro. O app calcula sozinho o tempo de troca de óleo, freios e pneus!\n\n` +
           `💡 O seu **Lucro Líquido Real** é calculado automaticamente na tela inicial do app!`;
  }

  // 3. Sobre o app / Saber mais / Para que serve
  if (q.includes('saber mais') || q.includes('sobre esse app') || q.includes('sobre o app') || q.includes('motor-ia') || q.includes('motor ia') || q.includes('ajuda em que') || q.includes('pra que serve') || q.includes('o que e') || q.includes('funciona')) {
    return `🚗 **Bem-vindo ao Motor IA — O Copiloto do Motorista de Aplicativo!**\n\n` +
           `Este aplicativo foi construído sob medida para quem roda na Uber, 99 ou Indrive ter mais dinheiro no bolso.\n\n` +
           `✨ **Recursos Principais:**\n` +
           `• **Lucro Líquido Real:** Saiba exatamente o que sobrou no bolso descontando gasolina e refeições.\n` +
           `• **Garagem & Alertas Preventivos:** Acompanhe o odômetro (**${currentKm.toLocaleString('pt-BR')} KM**) e saiba exatamente quando trocar óleo, pastilhas e pneus.\n` +
           `• **Assistente IA Conectada:** Tire dúvidas sobre seus custos, estratégias de horário e melhor tipo de combustível.\n` +
           `• **Relatórios & Excel:** Baixe planilhas completas dos seus ganhos para seu controle pessoal.\n\n` +
           `👉 Dica: Comece adicionando suas corridas de hoje na aba **Finanças**!`;
  }

  // 4. Ganhos e Lucro de Hoje
  if (q.includes('hoje') || q.includes('ganhei') || q.includes('lucro') || q.includes('faturei') || q.includes('quanto fiz') || q.includes('resultado')) {
    return `📊 **Resumo de Hoje:**\n\n` +
           `• Faturamento Bruto: **R$ ${todayGross.toFixed(2)}**\n` +
           `• Despesas: **R$ ${todayExpenses.toFixed(2)}**\n` +
           `• **LUCRO LÍQUIDO REAL: R$ ${todayNet.toFixed(2)}**\n\n` +
           (todayGross === 0 ? "💡 Toque na aba **Finanças** para lançar suas corridas e ver seu lucro calculado!" : "🔥 Continue focado na gestão de despesas!");
  }

  // 5. Garagem e Peças
  if (q.includes('garagem') || q.includes('peca') || q.includes('oleo') || q.includes('pneu') || q.includes('freio') || q.includes('vencid') || q.includes('revis')) {
    if (overdue.length > 0) {
      return `🚨 **ATENÇÃO: Peças VENCIDAS!**\n` +
             overdue.map(p => `• **${p.name}**: Passou ${(currentKm - (p.lastKm + p.intervalKm)).toLocaleString('pt-BR')} KM da troca.`).join('\n') +
             `\n\n💡 Clique no botão **Renovar** na aba Garagem após trocar a peça!`;
    }
    return `✅ **Sua garagem está 100% em dia!** Odômetro atual: **${currentKm.toLocaleString('pt-BR')} KM**.`;
  }

  // 6. Saudações
  if (q.includes('oi') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
    return `Olá, parceiro motorista! Sou a Motor IA, sua consultora financeira e mecânica.\n\n` +
           `Como posso te ajudar agora? Você pode me perguntar como lançar seus ganhos, sobre a saúde do seu carro ou quanto você lucrou hoje!`;
  }

  // 7. Resposta Padrão Inteligente com Instrução Direta
  return `Sou a Motor IA, sua consultora pessoal!\n\n` +
         `💡 **Como posso te ajudar agora?**\n` +
         `• Digite **"como adicionar meus dados"** para ver o tutorial de uso.\n` +
         `• Digite **"quanto ganhei hoje"** para ver seu faturamento real.\n` +
         `• Digite **"como tá o carro"** para ver o alerta da garagem.\n\n` +
         `📊 **Seu status atual:** Lucro Hoje R$ ${todayNet.toFixed(2)} | Odômetro ${currentKm.toLocaleString('pt-BR')} KM.`;
}
