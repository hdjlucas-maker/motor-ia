import React from 'react';
import { TrendingUp, Car, Bike, MapPin, Clock, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useUser } from '../../context/UserContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getTodayMetrics } = useFinance();
  const { user, vehicleProfile, setShowVehicleModal } = useUser();
  const metrics = getTodayMetrics();
  
  const isMoto = vehicleProfile?.type === 'moto';
  const formatCurrency = (val) => `R$ ${val.toFixed(2).replace('.', ',')}`;

  return (
    <div className="dashboard-container">
      {/* Card de Boas-Vindas & Veículo */}
      <div className="driver-profile-card glass-panel">
        <div className="driver-avatar-flex">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
            alt="Avatar Motorista" 
            className="driver-avatar"
          />
          <div>
            <div className="driver-name-badge">
              <h3>{user?.name || 'Motorista Parceiro'}</h3>
              <span className="online-pill"><CheckCircle2 size={12} /> Online</span>
            </div>
            <p className="driver-email">{user?.email || 'motorista@gmail.com'}</p>
          </div>
        </div>

        <div className="driver-vehicle-info" onClick={() => setShowVehicleModal(true)}>
          <div className="vehicle-icon-box">
            {isMoto ? <Bike size={22} className="icon-gold" /> : <Car size={22} className="icon-blue" />}
          </div>
          <div className="vehicle-details">
            <span className="v-title">{vehicleProfile?.brand} {vehicleProfile?.model} ({vehicleProfile?.year})</span>
            <span className="v-km">Odômetro: {(vehicleProfile?.currentKm || 85000).toLocaleString('pt-BR')} KM • {vehicleProfile?.fuelType}</span>
          </div>
          <Settings size={18} className="v-edit-icon" />
        </div>
      </div>

      {/* Alerta Inteligente da IA */}
      <div className="ai-alert-card glass-panel">
        <div className="ai-header">
          <AlertCircle size={20} className="ai-icon" />
          <h3>Dica da Motor IA para seu {vehicleProfile?.model || 'Veículo'}</h3>
        </div>
        <p>
          {isMoto 
            ? `Com a sua ${vehicleProfile?.model || 'Moto'}, lembre-se de lubrificar a corrente a cada 500 KM e conferir a folga. Guarde R$ 0,10 por KM para trocas de pneu e óleo!` 
            : `Para o seu ${vehicleProfile?.model || 'Carro'}, faça a calibragem semanal dos pneus com ele frio. Separe R$ 0,25 por KM rodado para a caixinha de revisão!`}
        </p>
      </div>

      {/* Visão Financeira Principal */}
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

      {/* Métricas do Dia */}
      <section className="metrics-section">
        <h3>Métricas de Hoje</h3>
        <div className="metrics-grid">
          <div className="metric-item glass-panel">
            <Clock size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Categoria</span>
              <span className="m-value">{vehicleProfile?.category || 'Uber / 99'}</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            <MapPin size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Odômetro</span>
              <span className="m-value">{(vehicleProfile?.currentKm || 85000).toLocaleString('pt-BR')} KM</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            {isMoto ? <Bike size={20} className="metric-icon" /> : <Car size={20} className="metric-icon" />}
            <div className="metric-info">
              <span className="m-label">Reserva/KM</span>
              <span className="m-value">{isMoto ? 'R$ 0,10/KM' : 'R$ 0,25/KM'}</span>
            </div>
          </div>
          <div className="metric-item glass-panel">
            <TrendingUp size={20} className="metric-icon" />
            <div className="metric-info">
              <span className="m-label">Status Garagem</span>
              <span className="m-value" style={{ color: 'var(--success)' }}>100% Em Dia</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
