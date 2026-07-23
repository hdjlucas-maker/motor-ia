import React from 'react';
import { TrendingUp, Car, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getTodayMetrics } = useFinance();
  const metrics = getTodayMetrics();
  
  const formatCurrency = (val) => `R$ ${val.toFixed(2).replace('.', ',')}`;
  return (
    <div className="dashboard-container">
      {/* AI Smart Alert */}
      <div className="ai-alert-card glass-panel">
        <div className="ai-header">
          <AlertCircle size={20} className="ai-icon" />
          <h3>Dica da IA</h3>
        </div>
        <p>Você trabalhou 310 km hoje. Pela quilometragem, faltam cerca de 1.200 km para a próxima troca de óleo. Se guardar R$ 25 por dia, terá o valor da revisão.</p>
      </div>

      {/* Main Financial Overview */}
      <section className="financial-overview">
        <div className="balance-card">
          <span className="label">Lucro Líquido Real (Hoje)</span>
          <h2>{formatCurrency(metrics.net)}</h2>
          {metrics.net >= 0 ? (
            <div className="trend positive">
              <TrendingUp size={16} />
              <span>Bom dia de trabalho!</span>
            </div>
          ) : (
            <div className="trend negative" style={{ background: 'rgba(225, 25, 0, 0.1)', color: 'var(--danger)' }}>
              <span>Prejuízo no dia</span>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card glass-panel">
            <span className="stat-label">Bruto</span>
            <span className="stat-value text-gradient">{formatCurrency(metrics.gross)}</span>
          </div>
          <div className="stat-card glass-panel">
            <span className="stat-label">Gastos</span>
            <span className="stat-value danger">{formatCurrency(metrics.expenses)}</span>
          </div>
        </div>
      </section>

      {/* Daily Metrics */}
      <section className="metrics-section">
        <h3>Métricas de Hoje</h3>
        <div className="metrics-grid">
          <div className="metric-item glass-panel">
            <Clock size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Horas</span>
              <span className="m-value">6h 30m</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            <MapPin size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Rodado</span>
              <span className="m-value">124 km</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            <Car size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Custo/KM</span>
              <span className="m-value">R$ 0,92</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            <TrendingUp size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Ganho/Hora</span>
              <span className="m-value">R$ 20,84</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
