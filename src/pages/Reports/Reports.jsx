import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Download, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './Reports.css';

const Reports = () => {
  const { transactions } = useFinance();
  const [period, setPeriod] = useState('all'); // 'today' | 'month' | 'all'

  // Filter transactions based on period
  const filteredTransactions = transactions.filter(t => {
    if (period === 'all') return true;
    const today = new Date().toISOString().split('T')[0];
    if (period === 'today') return t.date === today;
    if (period === 'month') {
      const currentMonth = today.substring(0, 7);
      return t.date.startsWith(currentMonth);
    }
    return true;
  });

  const totalGross = filteredTransactions
    .filter(t => t.type === 'ganho')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'gasto')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const netProfit = totalGross - totalExpenses;

  // Export to CSV / Excel
  const exportToExcel = () => {
    if (filteredTransactions.length === 0) {
      alert("Nenhum dado disponível para exportar no período selecionado!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,ID;Data;Tipo;Categoria;Descricao;Valor (R$)\n";

    filteredTransactions.forEach(t => {
      csvContent += `${t.id};${t.date};${t.type.toUpperCase()};${t.category};${t.title};${t.amount.toFixed(2).replace('.', ',')}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_motor_ia_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print
  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="reports-container">
      <div className="page-header">
        <h2>Relatórios & Exportação</h2>
        <p>Gere relatórios detalhados para seu controle</p>
      </div>

      {/* Period Filter */}
      <div className="filter-bar glass-panel">
        <Calendar size={18} className="filter-icon" />
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="period-select">
          <option value="all">Todo o Histórico</option>
          <option value="month">Este Mês</option>
          <option value="today">Hoje</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="report-summary-grid">
        <div className="r-card glass-panel">
          <span className="r-label">Ganhos Brutos</span>
          <span className="r-value success">R$ {totalGross.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="r-card glass-panel">
          <span className="r-label">Total de Gastos</span>
          <span className="r-value danger">R$ {totalExpenses.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="r-card glass-panel full-width">
          <span className="r-label">Lucro Líquido Real</span>
          <span className={`r-value-lg ${netProfit >= 0 ? 'success' : 'danger'}`}>
            R$ {netProfit.toFixed(2).replace('.', ',')}
          </span>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="export-actions">
        <button className="btn export-btn excel-btn" onClick={exportToExcel}>
          <FileSpreadsheet size={20} />
          <span>Exportar Planilha Excel (.CSV)</span>
        </button>

        <button className="btn export-btn pdf-btn" onClick={exportToPDF}>
          <FileText size={20} />
          <span>Gerar Relatório PDF / Imprimir</span>
        </button>
      </div>

      {/* Transaction History Table */}
      <div className="history-section">
        <h3>Histórico do Período ({filteredTransactions.length} lançamentos)</h3>
        <div className="history-table-wrapper glass-panel">
          <table className="history-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.date}</td>
                    <td><span className={`badge-sm ${t.type}`}>{t.type}</span></td>
                    <td>{t.category}</td>
                    <td className={t.type === 'ganho' ? 'success' : 'danger'}>
                      R$ {t.amount.toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
