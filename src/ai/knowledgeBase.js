/**
 * Base de Conhecimento e Central de FAQ Completo de Manutenção Preventiva (Carros e Motos)
 * e Suporte ao Aplicativo Motor IA.
 */

export const MAINTENANCE_FAQ_CATEGORIES = [
  {
    id: 'carro',
    title: '🚗 Manutenção de Carro',
    icon: 'Car',
    description: 'Cuidados essenciais com óleo, radiador, pneus, freios e correia.'
  },
  {
    id: 'moto',
    title: '🏍️ Manutenção de Moto',
    icon: 'Bike',
    description: 'Kit relação, lubrificação de corrente, óleo 4T e pneus.'
  },
  {
    id: 'app',
    title: '📱 Suporte & Uso do App',
    icon: 'HelpCircle',
    description: 'Como lançar corridas, despesas, usar a Garagem e ver lucros.'
  },
  {
    id: 'financas',
    title: '💰 Finanças & Custo/KM',
    icon: 'DollarSign',
    description: 'Reserva por KM, custo por rodagem e cálculo de flex.'
  },
  {
    id: 'emergencia',
    title: '🚨 Emergências na Rua',
    icon: 'AlertTriangle',
    description: 'O que fazer se o motor esquentar, acender luz ou falhar.'
  }
];

export const FAQ_ITEMS = [
  // --- CARROS ---
  {
    id: 'carro-oleo',
    category: 'carro',
    question: 'De quanto em quanto tempo devo trocar o óleo e o filtro do carro?',
    keywords: ['oleo', 'filtro', 'troca de oleo', 'lubrificante', '5000km'],
    answer: `🛢️ **Troca de Óleo e Filtro de Motor (Carro):**\n\n` +
            `• **Intervalo:** A cada **5.000 KM** para uso urbano severo (rodando em Uber/99) ou **10.000 KM** em rodovias (ou no máximo 6 meses).\n` +
            `• **Filtro de Óleo:** **Troque SEMPRE junto com o óleo novo!** Colocar óleo novo mantendo o filtro velho sujo contamina o óleo novo na hora.\n` +
            `• **Filtro de Ar do Motor:** Troque a cada **10.000 a 15.000 KM**. Filtro entupido faz o carro gastar até 15% a mais de combustível.\n` +
            `• **Checagem:** Confira o nível na vareta 1x por semana com o motor frio e o carro em local plano.`
  },
  {
    id: 'carro-radiador',
    category: 'carro',
    question: 'Como cuidar do radiador e do sistema de arrefecimento do carro?',
    keywords: ['radiador', 'agua', 'arrefecimento', 'aditivo', 'esquentando', 'temperatura'],
    answer: `🌡️ **Cuidados com o Radiador & Arrefecimento (Carro):**\n\n` +
            `• **NUNCA use água de torneira!** O cloro e os minerais corroem o bloco, a bomba d'água e o radiador por dentro.\n` +
            `• **O que usar:** **Água desmineralizada + Aditivo concentrado orgânico** na proporção correta.\n` +
            `• **Nível do Reservatório:** Verifique semanalmente com o motor **frio**.\n` +
            `• **⚠️ PERIGO:** Nunca abra a tampa do reservatório com o motor quente! A água sob pressão pode espirrar e causar queimaduras gravíssimas.`
  },
  {
    id: 'carro-pneus',
    category: 'carro',
    question: 'Como calibrar os pneus e quando fazer alinhamento e balanceamento?',
    keywords: ['pneu', 'calibrar', 'calibragem', 'alinhamento', 'balanceamento', 'twi'],
    answer: `🛞 **Pneus, Calibragem e Geometria (Carro):**\n\n` +
            `• **Calibragem Fria:** Calibre toda semana com os pneus **frios** (rodou menos de 3 KM). Pneu murcho aumenta o consumo de combustível em 10% e desgasta as bordas.\n` +
            `• **Alinhamento & Balanceamento:** Faça a cada **10.000 KM** ou se sentir o volante trepidar ou o carro puxando para um lado.\n` +
            `• **Indicador TWI:** Olhe as marcações nos sulcos da borracha. Se o pneu gastar até o indicador TWI (1.6mm), está careca: risco enorme de aquaplanagem e multa gravíssima!`
  },
  {
    id: 'carro-freios',
    category: 'carro',
    question: 'Como identificar se as pastilhas e discos de freio estão gastos?',
    keywords: ['freio', 'pastilha', 'disco', 'chiado', 'barulho ao frear', 'fluido'],
    answer: `🛑 **Manutenção do Sistema de Freios (Carro):**\n\n` +
            `• **Chiado Metálico:** Se escutar um apito ou barulho metálico ao pisar no freio, a pastilha acabou e está rando o disco. Substitua imediatamente!\n` +
            `• **Pedal Fofo/Baixo:** Sinal de ar no sistema ou fluido de freio vencido (absorveu água).\n` +
            `• **Fluido de Freio:** Troque o fluido DOT4 a cada **20.000 KM ou 1 ano**.`
  },
  {
    id: 'carro-correia-velas',
    category: 'carro',
    question: 'Quando devo trocar a correia dentada, velas e bateria?',
    keywords: ['correia', 'correia dentada', 'vela', 'cabos', 'bateria', 'ignicao'],
    answer: `⚙️ **Correia Dentada, Velas e Bateria (Carro):**\n\n` +
            `• **Correia Dentada:** Troque a cada **40.000 KM a 50.000 KM** ou 3 anos. Se a correia quebrar rodando, o motor atropela as válvulas e o prejuízo passa de R$ 4.000!\n` +
            `• **Velas de Ignição:** Troque a cada **20.000 KM a 30.000 KM**. Velas gastas deixam a aceleração falha e disparam o consumo de combustível.\n` +
            `• **Bateria:** Duração média de 2 a 3 anos em uso intensivo de aplicativo.`
  },

  // --- MOTOS ---
  {
    id: 'moto-relacao',
    category: 'moto',
    question: 'Como cuidar da relação (corrente, pinhão e coroa) da moto?',
    keywords: ['moto', 'corrente', 'relacao', 'pinhao', 'coroa', 'esticar corrente', 'lubrificar'],
    answer: `⛓️ **Kit Relação & Corrente de Moto (iFood / Rappi / Uber Flash):**\n\n` +
            `• **Lubrificação:** Lubrifique a corrente a cada **500 KM** ou **imediatamente após rodar na chuva** (use óleo 90 ou spray para corrente).\n` +
            `• **Folga Correta:** Mantenha a folga entre **2 cm e 3 cm**.\n` +
            `  - Corrente muito folgada: pode escapar e travar a roda traseira (risco de queda grave).\n` +
            `  - Corrente muito esticada: força os rolamentos da roda e do câmbio.\n` +
            `• **Substituição:** Se os dentes da coroa/pinhão estiverem finos ou curvados (estilo "dente de tubarão"), troque o kit completo!`
  },
  {
    id: 'moto-oleo',
    category: 'moto',
    question: 'Qual o intervalo correto de troca de óleo 4T na moto de entrega?',
    keywords: ['moto oleo', 'oleo 4t', 'troca oleo moto', 'vareta moto'],
    answer: `🛢️ **Troca de Óleo de Motor 4T (Moto):**\n\n` +
            `• **Intervalo:** Troque entre **1.000 KM e 2.500 KM** dependendo do modelo e do uso urbano intensivo.\n` +
            `• **Atenção:** Motor de moto roda em alta temperatura e alta rotação. Rodar com óleo baixo ou queimado funde o motor rapidamente.\n` +
            `• **Checagem:** Verifique o nível pela vareta/visor toda semana com a moto em local plano e no cavalete central.`
  },
  {
    id: 'moto-pneus-freios',
    category: 'moto',
    question: 'Como manter pneus e freios de moto seguros para trabalhar?',
    keywords: ['pneu moto', 'freio moto', 'lona', 'pastilha moto', 'calibrar moto'],
    answer: `🛞 **Pneus & Freios de Moto:**\n\n` +
            `• **Calibragem:** Calibre semanalmente. Pneu murcho tira a estabilidade em curvas e causa derrapagens.\n` +
            `• **Pastilhas e Lonas:** Verifique a marca de desgaste no espelho do freio a cada **3.000 KM**.\n` +
            `• **Cabos de Freio e Embreagem:** Mantenha os cabos regulados e lubrificados para não arrebentarem durante o expediente.`
  },

  // --- SUPORTE E USO DO APP ---
  {
    id: 'app-lancamento-ganhos',
    category: 'app',
    question: 'Como lançar meus ganhos da Uber, 99 ou entregas no app?',
    keywords: ['lancar ganho', 'cadastrar corrida', 'adicionar dinheiro', 'uber', '99', 'ifood'],
    answer: `📱 **Como Lançar Seus Ganhos:**\n\n` +
            `1. Acesse a aba **Finanças** no menu inferior.\n` +
            `2. Clique na aba **"Lançar Ganho"**.\n` +
            `3. Digite o valor recebido das suas corridas ou entregas do dia.\n` +
            `4. Escolha a categoria (ex: Uber, 99, Particular, Entregas) e a data.\n` +
            `5. Toque em **Salvar**.\n\n` +
            `💡 O dashboard atualiza na hora calculando seu **Lucro Líquido Real**!`
  },
  {
    id: 'app-lancamento-despesas',
    category: 'app',
    question: 'Como registrar gastos com combustível, comida e oficina?',
    keywords: ['lancar despesa', 'gasolina', 'combustivel', 'comida', 'oficina', 'gasto'],
    answer: `⛽ **Como Registrar Suas Despesas:**\n\n` +
            `1. Vá até a aba **Finanças**.\n` +
            `2. Escolha **"Lançar Despesa"**.\n` +
            `3. Insira o valor do gasto.\n` +
            `4. Selecione o tipo de despesa (Combustível, Alimentação, Manutenção, Lavagem, Pedágio).\n` +
            `5. Clique em **Salvar** para abater esse valor do seu lucro do dia.`
  },
  {
    id: 'app-garagem',
    category: 'app',
    question: 'Como utilizar a aba Garagem para controlar peças e óleo?',
    keywords: ['garagem', 'odometro', 'km', 'cadastrar peca', 'renovar peca'],
    answer: `🛠️ **Como Funciona a Garagem Preventiva:**\n\n` +
            `1. Acesse a aba **Garagem**.\n` +
            `2. Atualize a quilometragem do seu **Odômetro Atual**.\n` +
            `3. O Motor IA calcula automaticamente o prazo de troca de cada componente (Óleo, Filtros, Pneus, Velas, Freios).\n` +
            `4. Quando fizer uma manutenção no mecânico, clique em **"Renovar"** ao lado da peça para zerar a contagem!`
  },
  {
    id: 'app-relatorios',
    category: 'app',
    question: 'Como exportar meus dados financeiros para Excel ou PDF?',
    keywords: ['relatorio', 'excel', 'pdf', 'exportar', 'baixar planilha'],
    answer: `📊 **Como Exportar Relatórios Completo:**\n\n` +
            `1. Vá na aba **Relatórios** no menu inferior.\n` +
            `2. Escolha o período desejado (Hoje, Esta Semana, Este Mês ou Personalizado).\n` +
            `3. Clique no botão **"Baixar Excel (.xlsx)"** ou **"Imprimir PDF"**.\n` +
            `4. Você terá uma planilha formatada com receitas, custos por KM e margem de lucro!`
  },

  // --- FINANÇAS E CUSTO POR KM ---
  {
    id: 'financas-reserva-km',
    category: 'financas',
    question: 'Quanto devo guardar por KM rodado para cobrir a manutenção?',
    keywords: ['guardar por km', 'reserva por km', 'reserva de emergencia', 'custo por km'],
    answer: `💵 **Reserva Financeira por KM Rodado:**\n\n` +
            `• **Para Carros:** Guarde entre **R$ 0,20 e R$ 0,30** para cada KM rodado em trabalho.\n` +
            `• **Para Motos:** Guarde entre **R$ 0,08 e R$ 0,12** por KM rodado.\n\n` +
            `📌 **Exemplo prático de carro:** Se rodou 200 KM hoje, transfira **R$ 40,00** para uma caixinha de manutenção. Quando o pneu ou o óleo vencerem, você terá dinheiro em caixa sem precisar passar sufoco no cartão!`
  },
  {
    id: 'financas-flex-etanol-gasolina',
    category: 'financas',
    question: 'Qual compensa mais no carro flex: Etanol (Álcool) ou Gasolina?',
    keywords: ['etanol ou gasolina', 'alcool ou gasolina', 'flex', 'calculo flex'],
    answer: `⛽ **Cálculo Prático de Combustível Flex:**\n\n` +
            `• **Regra Geral dos 70%:** Divida o preço do Etanol pelo preço da Gasolina.\n` +
            `  - Se o resultado for **abaixo de 0,70**: Vale a pena colocar **Etanol**.\n` +
            `  - Se for **acima de 0,70**: Vale a pena colocar **Gasolina**.\n\n` +
            `💡 *Dica de aplicativo:* Em motores 1.0 rodando forte no trânsito pesado com ar-condicionado ligado, a gasolina costuma entregar autonomia superior e consumo mais constante.`
  },

  // --- EMERGÊNCIAS NA RUA ---
  {
    id: 'emergencia-esquentando',
    category: 'emergencia',
    question: 'O motor começou a esquentar ou sair fumaça no capô: o que fazer?',
    keywords: ['esquentando', 'fumaca', 'ferveu', 'motor quente', 'ponteiro subiu'],
    answer: `🚨 **EMERGÊNCIA: Motor Esquentando ou Fervendo:**\n\n` +
            `1. **Pare imediatamente em local seguro** e desligue o motor.\n` +
            `2. **Ligue o pisca-alerta** e coloque o triângulo.\n` +
            `3. **NÃO abra a tampa do radiador ou reservatório!** A água fervendo espirra como um chafariz pressurizado.\n` +
            `4. Verifique se a ventoinha está ligada e se há vazamento visível de água embaixo do carro.\n` +
            `5. Espere o motor esfriar por pelo menos 30 a 45 minutos antes de verificar o nível de água/aditivo.`
  },
  {
    id: 'emergencia-luz-injecao',
    category: 'emergencia',
    question: 'A luz amarela da injeção eletrônica ou vermelha do óleo acendeu: o que significa?',
    keywords: ['luz injeção', 'luz vermelha oleo', 'luz amarela', 'painel acendeu'],
    answer: `⚠️ **Aviso de Luzes no Painel:**\n\n` +
            `• 🔴 **LUZ VERMELHA DO ÓLEO (Alerta Crítico):** Pare o carro NA HORA e desligue o motor! Significa falta de pressão de óleo. Rodar assim destrói o motor em poucos minutos.\n` +
            `• 🟡 **LUZ AMARELA DA INJEÇÃO:** Indica falha na queima de combustível, combustível adulterado, vela/cabo ruim ou sensor de oxigênio (sonda lambda). Você pode rodar até a oficina mais próxima, sem forçar aceleração.`
  }
];

/**
 * Busca itens da FAQ por palavra-chave ou texto de busca do usuário
 */
export function searchFAQ(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return FAQ_ITEMS.filter(item => {
    const qMatch = item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
    const aMatch = item.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
    const kwMatch = item.keywords.some(kw => q.includes(kw));
    return qMatch || aMatch || kwMatch;
  });
}
