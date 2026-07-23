export function buildDriverContext({ transactions = [], currentKm = 0, maintenances = [] }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.date === todayStr);

  const todayGross = todayTransactions.filter(t => t.type === 'ganho').reduce((acc, t) => acc + Number(t.amount), 0);
  const todayExpenses = todayTransactions.filter(t => t.type === 'gasto').reduce((acc, t) => acc + Number(t.amount), 0);
  const todayNet = todayGross - todayExpenses;

  const totalGross = transactions.filter(t => t.type === 'ganho').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpenses = transactions.filter(t => t.type === 'gasto').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalNet = totalGross - totalExpenses;

  const overdueParts = maintenances.filter(m => (m.lastKm + m.intervalKm) < currentKm);
  const urgentParts = maintenances.filter(m => {
    const rem = (m.lastKm + m.intervalKm) - currentKm;
    return rem >= 0 && rem <= 1000;
  });

  return {
    todayStr,
    todayGross,
    todayExpenses,
    todayNet,
    totalGross,
    totalExpenses,
    totalNet,
    currentKm,
    overdueParts,
    urgentParts,
    maintenancesCount: maintenances.length
  };
}
