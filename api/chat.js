export default async function handler(req, res) {
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
        reply: "Olá! Sou a Motor IA, sua consultora pessoal de manutenção (carro e moto) e finanças. Como posso te ajudar hoje?" 
      });
    }

    const rawApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.AI_API_KEY || '';
    const apiKey = rawApiKey.trim();

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

    // Tenta chamada direta ao Google Gemini AI (suporta chaves AIzaSy... e o novo padrão AQ...)
    if (apiKey && apiKey.length > 5) {
      try {
        const systemPrompt = `
Você é a Motor IA, a mais completa e inteligente assistente consultora financeira, operacional e mecânica para motoristas de carros e entregadores de motos de aplicativo (Uber, 99, Indrive, iFood, Rappi, Zé Delivery).

QUANDO O USUÁRIO PERGUNTAR SOBRE O APP, "PARA QUE SERVE ESTE APP?", "ESSE APP SERVE PRA QUE?", "SABER MAIS SOBRE O MOTOR IA", "COMO O APP ME AJUDA?":
Responda com entusiasmo, clareza e autoridade destacando como você ajuda o motorista no dia a dia:
1. Lucro Líquido Real (descontando combustível, alimentação e taxas do faturamento bruto).
2. Garagem Preventiva (avisando trocas de óleo, filtros, pneus, freios e corrente da moto antes de quebrar na rua).
3. Reserva Financeira por KM (sabendo quanto guardar por KM rodado para não passar sufoco).
4. Socorro & Consultoria Mecânica na Rua (instruções para motor esquentando, luzes do painel e ruídos).
5. Relatórios em Excel/PDF para controle financeiro total.

SEUS CONHECIMENTOS PRINCIPAIS:
1. MANUTENÇÃO PREVENTIVA DE CARRO:
   - Troca de óleo de motor + filtro a cada 5.000 KM (uso severo urbano) ou 10.000 KM (estrada). Nunca trocar óleo sem trocar o filtro.
   - Sistema de arrefecimento: Água desmineralizada + aditivo concentrado (NUNCA água de torneira por causa do cloro que corrói tudo). Nível com motor frio.
   - Pneus e Calibragem: Calibragem fria semanal; alinhamento e balanceamento a cada 10.000 KM. Indicador TWI (1.6mm).
   - Freios: Pastilhas, discos, fluido DOT4 a cada 20.000 KM/1 ano. Chiado metálico indica pastilha queimando o disco.
   - Correia Dentada (40k-50k km), Velas de Ignição (20k-30k km), Suspensão, Bateria (2-3 anos), Embreagem.

2. MANUTENÇÃO PREVENTIVA DE MOTO:
   - Kit Relação (corrente, pinhão, coroa): Lubrificação a cada 500 KM ou pós-chuva (óleo 90/spray). Folga entre 2cm e 3cm. Dentes finos/curvados = troca imediata.
   - Óleo 4T: Troca entre 1.000 KM e 2.500 KM conforme uso. Checagem semanal na vareta.
   - Freios (lonas/pastilhas) e Pneus: Calibragem semanal e verificação limite no espelho de freio.

3. SUPORTE DO APLICATIVO MOTOR IA:
   - Lançar Ganhos: Aba Finanças -> Lançar Ganho -> Valor -> Salvar.
   - Lançar Gastos: Aba Finanças -> Lançar Despesa -> Categoria (Combustível, Comida, Oficina, Lavagem) -> Salvar.
   - Garagem Preventiva: Aba Garagem -> Digitar odômetro atual -> Renovar peças ao realizar manutenção.
   - Relatórios: Aba Relatórios -> Baixar Excel (.xlsx) ou Imprimir PDF.

4. FINANÇAS & CUSTO POR KM:
   - Reserva de Emergência/Manutenção: Guardar R$ 0,20 a R$ 0,30 por KM para Carros; R$ 0,08 a R$ 0,12 por KM para Motos.
   - Cálculo Flex (Etanol vs Gasolina): Se (Preço Etanol / Preço Gasolina) < 0,70 vale Etanol; caso contrário, Gasolina.

5. EMERGÊNCIAS NA RUA:
   - Motor Esquentando/Fumaça: Pare no acostamento, desligue o motor, ligue pisca-alerta, NUNCA abra o reservatório quente.
   - Luz Vermelha do Óleo: Parar OBRIGATORIAMENTE na hora.
   - Luz Amarela da Injeção: Falha de queima/combustível adulterado.

DIRETRIZES DE RESPOSTA:
- Responda em Português do Brasil de forma clara, profissional, didática, amigável e motivadora.
- Formate com tópicos em marcadores (•) e termos importantes em **negrito**.
- Responda diretamente à dúvida do motorista com passo a passo prático.

TELEMETRIA ATUAL DO MOTORISTA:
- Data Hoje: ${todayStr}
- Faturamento Bruto Hoje: R$ ${todayGross.toFixed(2)}
- Despesas Hoje: R$ ${todayExpenses.toFixed(2)}
- Lucro Líquido Real Hoje: R$ ${todayNet.toFixed(2)}
- Odômetro Atual: ${currentKm.toLocaleString('pt-BR')} KM
- Peças Vencidas: ${overdue.map(p => p.name).join(', ') || 'Nenhuma'}
- Peças Próximas de Trocar: ${urgent.map(p => p.name).join(', ') || 'Nenhuma'}
        `;

        const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
        
        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
            const apiResponse = await fetch(url, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + `\n\nPERGUNTA DO MOTORISTA/USUÁRIO: "${userQuery}"` }] }]
              })
            });

            if (apiResponse.ok) {
              const data = await apiResponse.json();
              const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (reply && reply.trim()) {
                return res.status(200).json({ reply: reply.trim() });
              }
            } else {
              const errorText = await apiResponse.text();
              console.warn(`Modelo ${model} respondeu status ${apiResponse.status}:`, errorText);
            }
          } catch (modelErr) {
            console.warn(`Tentativa com modelo ${model} falhou:`, modelErr);
          }
        }
      } catch (geminiErr) {
        console.warn('Erro na chamada Gemini API no Vercel:', geminiErr);
      }
    }

    // Engine Local Serverless com Resposta Inteligente Contextualizada
    const reply = generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent });
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Erro na API Serverless:', error);
    return res.status(200).json({ 
      reply: "Sou a Motor IA! Estou pronta para te ajudar com seu faturamento, lucros, suporte do app e manutenção do seu carro ou moto. Pode me fazer uma pergunta!" 
    });
  }
}

function generateServerlessLocalReply({ userQuery, todayNet, todayGross, todayExpenses, currentKm, overdue, urgent }) {
  const q = userQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // 1. INTENÇÃO PRINCIPAL: APRESENTAÇÃO DO APP MOTOR IA / PARA QUE SERVE / COMO AJUDA O MOTORISTA
  const isAppInfoQuery = 
    q.includes('motor ia') || 
    q.includes('motor-ia') || 
    q.includes('sobre o app') || 
    q.includes('sobre esse app') || 
    q.includes('saber mais') || 
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
    q.includes('como ajuda');

  if (isAppInfoQuery) {
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

  // 2. FORA DO ESCOPO
  const offTopicKeywords = ['pao', 'bolo', 'futebol', 'jogo', 'politica', 'medicina', 'filme', 'musica', 'piada', 'namorad', 'receita'];
  if (offTopicKeywords.some(kw => q.includes(kw))) {
    return "Posso ajudar apenas com assuntos relacionados ao Motor IA, finanças e manutenção do seu veículo (carro ou moto) de trabalho. Se tiver dúvidas sobre faturamento, peças ou como usar o app, pode perguntar!";
  }

  // 3. EMERGÊNCIAS NA RUA
  if (q.includes('esquentando') || q.includes('fumaca') || q.includes('ferveu') || q.includes('painel acendeu') || q.includes('luz vermelha') || q.includes('luz de oleo') || q.includes('luz da injecao')) {
    if (q.includes('luz') || q.includes('painel')) {
      return `⚠️ **Guia de Luzes no Painel do Veículo:**\n\n` +
             `• 🔴 **Luz Vermelha do Óleo:** **PARE O CARRO NA HORA!** Desligue o motor imediatamente. Significa falta de pressão de óleo. Rodar assim destrói o motor.\n` +
             `• 🔴 **Luz da Bateria / Freio:** Verifique se a bateria descarregou ou se o freio de mão está puxado.\n` +
             `• 🟡 **Luz Amarela da Injeção Eletrônica:** Indica falha na combustão, combustível batizado ou sensor defeituoso. Vá dirigindo com calma até um mecânico de confiança.`;
    }
    return `🚨 **EMERGÊNCIA: Motor Esquentando ou Saindo Fumaça:**\n\n` +
           `1. **Pare imediatamente em local seguro** e desligue a ignição.\n` +
           `2. **Ligue o pisca-alerta** e posicione o triângulo de sinalização.\n` +
           `3. **NUNCA abra a tampa do reservatório ou do radiador enquanto estive quente!** Risco de queimaduras graves com água sob alta pressão.\n` +
           `4. Aguarde o motor esfriar totalmente (30 a 45 minutos) antes de verificar o reservatório de água desmineralizada + aditivo.`;
  }

  // 4. FAQ DE MOTO (Apenas palavra exata 'moto'/'motos', 'corrente', 'relacao', 'pinhao', 'coroa', 'oleo 4t' - Evitando confundir com 'motor')
  const isMotoQuery = /\bmotos?\b/.test(q) || q.includes('corrente') || q.includes('relacao') || q.includes('pinhao') || q.includes('coroa') || q.includes('oleo 4t');
  if (isMotoQuery) {
    return `🏍️ **Guia Básico de Manutenção Preventiva para Motos (iFood / Rappi / Uber Flash):**\n\n` +
           `1. **Kit Relação & Corrente:**\n` +
           `   • Lubrifique a corrente a cada **500 KM** (ou imediatamente após rodar na chuva) com óleo 90 ou spray lubrificante.\n` +
           `   • Mantenha a folga da corrente entre **2 cm e 3 cm**. Corrente muito solta pode escapar e travar a roda!\n\n` +
           `2. **Óleo de Motor 4T:**\n` +
           `   • Troque entre **1.000 KM e 2.500 KM** (uso urbano severo de entrega degrada rápido).\n` +
           `   • Verifique o nível pela vareta com a moto em local plano e no cavalete central.\n\n` +
           `3. **Pneus & Freios:**\n` +
           `   • Calibre semanalmente. Pneu murcho prejudica a estabilidade nas curvas.\n` +
           `   • Confira a margem de desgaste das pastilhas/lonas a cada 3.000 KM.`;
  }

  // 5. FAQ DE CARRO (Óleo, Filtros, Arrefecimento/Radiador, Pneus, Freios, Correia, Velas)
  if (q.includes('cuidar') || q.includes('manutencao') || q.includes('veiculo') || q.includes('carro') || q.includes('radiador') || q.includes('agua') || q.includes('calibrar') || q.includes('vela') || q.includes('correia')) {
    if (q.includes('radiador') || q.includes('agua') || q.includes('aditivo')) {
      return `🌡️ **Manutenção do Radiador e Arrefecimento do Carro:**\n\n` +
             `• **Nunca use água de torneira!** O cloro corrói o bloco e o radiador. Use **água desmineralizada + aditivo de radiador**.\n` +
             `• Verifique o nível no reservatório semanalmente com o motor **frio**.\n` +
             `• Troque todo o fluido de arrefecimento a cada **2 anos**.`;
    }

    if (q.includes('pneu') || q.includes('calibr') || q.includes('alinhament')) {
      return `🛞 **Cuidados com Pneus, Calibragem e Alinhamento:**\n\n` +
             `• **Calibragem Fria:** Calibre semanalmente com pneus frios. Pneu murcho gasta até 10% mais combustível!\n` +
             `• **Alinhamento & Balanceamento:** Faça a cada **10.000 KM**.\n` +
             `• **Marca TWI:** Se a borracha atingir os blocos de segurança TWI (1.6mm), o pneu está careca e precisa ser trocado imediatamente.`;
    }

    return `🚗 **Guia de Manutenção Preventiva Básica para Veículo de Trabalho:**\n\n` +
           `1. **Troca de Óleo e Filtro de Motor:**\n` +
           `   • Troque a cada **5.000 KM** (uso urbano severo de app) ou **10.000 KM** (estrada).\n` +
           `   • **Sempre troque o filtro de óleo junto com o óleo novo!**\n\n` +
           `2. **Sistema de Arrefecimento (Radiador):**\n` +
           `   • Use **água desmineralizada + aditivo orgânico**. Nunca coloque água da torneira.\n\n` +
           `3. **Pneus & Calibragem:**\n` +
           `   • Calibre semanalmente com pneus frios. Alinhamento/balanceamento a cada **10.000 KM**.\n\n` +
           `4. **Freios & Pastilhas:**\n` +
           `   • Se ouvir um chiado metálico ao pisar no freio, a pastilha gastou até o fim e está rando o disco. Substitua já!`;
  }

  // 6. SUPORTE DO APP E COMO USAR (Ganhos, Gastos, Garagem, Relatórios, Reserva)
  if (q.includes('faq') || q.includes('suporte') || q.includes('duvida') || q.includes('adicion') || q.includes('cadastr') || q.includes('lancar') || q.includes('como usar') || q.includes('ajuda')) {
    return `📖 **Central de Suporte & Como Usar o Motor IA:**\n\n` +
           `• 💰 **Como lançar faturamento Uber/99?**\n` +
           `  Aba **Finanças** -> clique em **Lançar Ganho** -> digite o valor e selecione a categoria -> clique em **Salvar**.\n\n` +
           `• ⛽ **Como lançar combustível e alimentação?**\n` +
           `  Aba **Finanças** -> clique em **Lançar Despesa** -> informe o valor e tipo de gasto -> clique em **Salvar**.\n\n` +
           `• 🛠️ **Como controlar o odômetro e a Garagem?**\n` +
           `  Aba **Garagem** -> informe a quilometragem atual do veículo (**${currentKm.toLocaleString('pt-BR')} KM**). O app alerta o vencimento do óleo, pneus e freios!\n\n` +
           `• 📊 **Como baixar relatórios em Excel/PDF?**\n` +
           `  Aba **Relatórios** -> selecione o período -> clique em **Baixar Excel (.xlsx)** ou **Imprimir PDF**.\n\n` +
           `• 💵 **Quanto guardar para manutenção?**\n` +
           `  Separe entre **R$ 0,20 e R$ 0,30 por KM** para carros, e **R$ 0,08 a R$ 0,12 por KM** para motos numa caixinha.`;
  }

  // 7. FINANÇAS, GUARDA POR KM E FLEX
  if (q.includes('reserva') || q.includes('guardar') || q.includes('custo por km') || q.includes('etanol') || q.includes('gasolina')) {
    if (q.includes('etanol') || q.includes('gasolina') || q.includes('flex')) {
      return `⛽ **Cálculo de Combustível Flex (Etanol vs Gasolina):**\n\n` +
             `• Divida o valor do litro do **Etanol** pelo valor da **Gasolina**.\n` +
             `• Se der **menos de 0,70**: Etanol é mais vantajoso.\n` +
             `• Se der **0,70 ou mais**: Gasolina rende mais e vale mais a pena!`;
    }
    return `💵 **Reserva Financeira por Quilômetro Rodado:**\n\n` +
           `• **Carros:** Guarde de **R$ 0,20 a R$ 0,30 por KM** rodado.\n` +
           `• **Motos:** Guarde de **R$ 0,08 a R$ 0,12 por KM** rodado.\n\n` +
           `💡 Guarde esse dinheiro diariamente numa conta rendendo 100% do CDI. Assim você paga pneus, óleo e revisões sem juros!`;
  }

  // 8. Ganhos e Lucro
  if (q.includes('hoje') || q.includes('ganhei') || q.includes('lucro') || q.includes('faturei') || q.includes('quanto fiz')) {
    return `📊 **Resumo Financeiro de Hoje:**\n\n` +
           `• Faturamento Bruto: **R$ ${todayGross.toFixed(2)}**\n` +
           `• Despesas: **R$ ${todayExpenses.toFixed(2)}**\n` +
           `• **LUCRO LÍQUIDO REAL: R$ ${todayNet.toFixed(2)}**\n\n` +
           (todayGross === 0 ? "💡 Registre suas corridas de hoje na aba **Finanças**!" : "🔥 Bom trabalho! Mantenha suas despesas controladas.");
  }

  // 9. Garagem
  if (q.includes('garagem') || q.includes('peca') || q.includes('oleo') || q.includes('pneu') || q.includes('freio') || q.includes('vencid')) {
    if (overdue.length > 0) {
      return `🚨 **ATENÇÃO: Peças VENCIDAS na Garagem!**\n` +
             overdue.map(p => `• **${p.name}**: Passou ${(currentKm - (p.lastKm + p.intervalKm)).toLocaleString('pt-BR')} KM da troca.`).join('\n') +
             `\n\n💡 Ao fazer a manutenção no mecânico, abra a aba Garagem e toque em **Renovar**!`;
    }
    return `✅ **Sua garagem está 100% em dia!** Odômetro atual: **${currentKm.toLocaleString('pt-BR')} KM**.`;
  }

  // 10. Saudações
  if (q.includes('oi') || q.includes('ola') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('boa noite')) {
    return `Olá! Sou a Motor IA, sua consultora pessoal de manutenção (carro e moto) e finanças para motorista.\n\n` +
           `Como posso te ajudar agora? Pode me perguntar para que serve o app, dicas de manutenção, como cuidar do radiador ou quanto você lucrou hoje!`;
  }

  // 11. Resposta Padrão Guiada
  return `Sou a Motor IA, sua consultora de faturamento, manutenção e suporte!\n\n` +
         `💡 **Respostas Rápidas & Central de FAQ:**\n` +
         `• Digite **"para que serve o app"** para entender como a IA te ajuda a lucrar mais.\n` +
         `• Digite **"como cuidar do carro"** para ver o guia de manutenção preventiva.\n` +
         `• Digite **"manutenção de moto"** para ver os cuidados com corrente e óleo 4T.\n` +
         `• Digite **"como usar o app"** para aprender a lançar corridas, despesas e usar a Garagem.\n` +
         `• Digite **"emergência"** para saber o que fazer com motor esquentando ou luzes acesas.\n\n` +
         `📊 **Seu status:** Lucro Hoje R$ ${todayNet.toFixed(2)} | Odômetro ${currentKm.toLocaleString('pt-BR')} KM.`;
}
