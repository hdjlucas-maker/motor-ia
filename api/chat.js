export default async function handler(req, res) {
  // Configura cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { userQuery, transactions = [], currentKm = 0, maintenances = [] } = req.body || {};

    if (!userQuery) {
      return res.status(400).json({ error: 'Consulta não fornecida.' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

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

    // Se houver chave API no servidor Vercel (GEMINI_API_KEY)
    if (apiKey) {
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

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`;

      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemPrompt + `\n\nPERGUNTA DO MOTORISTA: "${userQuery}"` }] }
          ]
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.status(200).json({ reply });
        }
      }
    }

    // Resposta contextual rica de fallback caso a chave não esteja configurada ainda no Vercel
    const q = userQuery.toLowerCase();

    if (q.includes('ajuda em que') || q.includes('pra que serve') || q.includes('o que faz') || q.includes('funciona')) {
      return res.status(200).json({
        reply: `🚗 **O Motor IA é o seu copiloto financeiro e mecânico completo!**\n\n` +
               `Ele ajuda você em 4 pilares principais:\n\n` +
               `1. **Lucro Líquido Real:** Mostra exatamente o dinheiro que sobra no seu bolso descontando combustível, alimentação e taxas.\n` +
               `2. **Garagem & Manutenção Preventiva:** Controla a quilometragem do seu carro (${currentKm.toLocaleString('pt-BR')} KM) e te avisa ANTES do óleo, pneus ou freios vencerem para não ficar na rua.\n` +
               `3. **Consultoria com IA:** Responde suas dúvidas de faturamento, estratégias de horário e cálculo de custos por KM rodado.\n` +
               `4. **Relatórios Excel e PDF:** Exporta todo seu histórico de ganhos e gastos em planilhas para seu controle pessoal.\n\n` +
               `💡 **Dica:** Registre seus ganhos da Uber/99 na aba **Finanças** para ver a mágica acontecer!`
      });
    }

    return res.status(200).json({ 
      reply: `Sou a Motor IA, sua consultora pessoal de faturamento e manutenção!\n\n` +
             `Com base nos seus dados cadastrados:\n` +
             `• Lucro Líquido Hoje: **R$ ${todayNet.toFixed(2)}**\n` +
             `• Odômetro do Veículo: **${currentKm.toLocaleString('pt-BR')} KM**\n` +
             (overdue.length > 0 ? `• 🚨 **${overdue.length} peça(s) vencida(s)** na Garagem.\n\n` : `• ✅ Nenhuma manutenção pendente.\n\n`) +
             `Como posso te ajudar hoje? Pode me perguntar sobre faturamento, custos por KM ou manutenção!`
    });

  } catch (error) {
    console.error('Erro na API Serverless:', error);
    return res.status(500).json({ error: 'Erro interno na API.' });
  }
}
