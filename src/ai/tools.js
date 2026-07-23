export const AI_TOOLS = {
  calculateNetProfit: (gross, expenses) => Number(gross || 0) - Number(expenses || 0),
  calculateMargin: (gross, net) => gross > 0 ? ((net / gross) * 100).toFixed(1) : 0,
  calculateReserve: (km, ratePerKm = 0.25) => Number(km || 0) * ratePerKm
};
