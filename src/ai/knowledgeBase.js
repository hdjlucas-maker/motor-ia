export const KNOWLEDGE_BASE = {
  fuelTypes: {
    GNV: "Ideal para rodar acima de 100km/dia. Economia média de 40% a 50% em comparação à gasolina.",
    Gasolina: "Combustível padrão de alta densidade energética.",
    Etanol: "Vantajoso quando o preço por litro é até 70% do valor da gasolina."
  },
  peakHours: [
    { period: "Manhã", hours: "06:00 às 09:00", description: "Deslocamento de ida ao trabalho / aeroportos" },
    { period: "Almoço", hours: "11:30 às 13:30", description: "Movimento em centros empresariais e shoppings" },
    { period: "Tarde/Noite", hours: "17:00 às 20:00", description: "Volta do trabalho e áreas universitárias" }
  ],
  maintenanceRules: {
    reservePerKmMin: 0.20,
    reservePerKmMax: 0.30,
    description: "Separe entre R$ 0,20 e R$ 0,30 por KM rodado para cobrir troca de óleo, pneus e pastilhas sem sobressaltos."
  }
};
