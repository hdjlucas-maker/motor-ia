import SYSTEM_PROMPT from './systemPrompt.js';
import { buildDriverContext } from './contextBuilder.js';

export function buildPrompt({ userQuery, transactions, currentKm, maintenances }) {
  const context = buildDriverContext({ transactions, currentKm, maintenances });

  return `
${SYSTEM_PROMPT}

[CONTEXTO DE TELEMETRIA EM TEMPO REAL]
- Data Atual: ${context.todayStr}
- Faturamento Bruto Hoje: R$ ${context.todayGross.toFixed(2)}
- Despesas Hoje: R$ ${context.todayExpenses.toFixed(2)}
- Lucro Líquido Hoje: R$ ${context.todayNet.toFixed(2)}
- Quilometragem Atual do Carro: ${context.currentKm} KM
- Peças Vencidas na Garagem: ${context.overdueParts.map(p => p.name).join(', ') || 'Nenhuma'}
- Peças Próximas do Vencimento (<=1.000 KM): ${context.urgentParts.map(p => p.name).join(', ') || 'Nenhuma'}

PERGUNTA DO MOTORISTA:
"${userQuery}"
`;
}
