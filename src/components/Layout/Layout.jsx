import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { RotateCcw, Car, Bike, Settings, Clock, Crown } from 'lucide-react';
import BottomNav from './BottomNav';
import VehicleModal from '../Onboarding/VehicleModal';
import { useUser } from '../../context/UserContext';
import { useSubscription } from '../../hooks/useSubscription';
import './Layout.css';

const Layout = () => {
  const { user, vehicleProfile, setShowVehicleModal } = useUser();
  const { status, daysLeft } = useSubscription(user?.id);

  const handleResetData = () => {
    const confirmMessage = "⚠️ ATENÇÃO: Esta ação apagará os dados locais salvos. Deseja redefinir os lançamentos?";
    
    if (window.confirm(confirmMessage)) {
      localStorage.clear();
      alert("✅ Aplicativo redefinido com sucesso!");
      window.location.reload();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title">
          <h2 className="text-gradient">Motor IA</h2>
          <a href="https://lucascorrea-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="creator-link">
            by Lucas.dev
          </a>
        </div>

        {/* Badge do Veículo Registrado */}
        <div className="header-vehicle-badge" onClick={() => setShowVehicleModal(true)} title="Clique para alterar seu veículo">
          {vehicleProfile?.type === 'moto' ? <Bike size={16} /> : <Car size={16} />}
          <span className="badge-text">{vehicleProfile?.model || 'Configurar Veículo'}</span>
          <Settings size={14} className="badge-edit-icon" />
        </div>

        <div className="header-actions">
          {status === 'trial' && (
            <Link to="/subscription" className="header-plan-badge header-plan-badge-trial" title="Ver planos de assinatura">
              <Clock size={14} />
              <span>{daysLeft}d grátis</span>
            </Link>
          )}
          {status === 'active' && (
            <Link to="/subscription" className="header-plan-badge header-plan-badge-active" title="Gerenciar assinatura">
              <Crown size={14} />
              <span>Premium</span>
            </Link>
          )}

          <button
            className="reset-btn"
            title="Apaga todos os dados salvos neste navegador (finanças, garagem, veículo)"
            onClick={handleResetData}
          >
            <RotateCcw size={16} />
            <span>Zerar dados</span>
          </button>
        </div>
      </header>

      {/* Modal Global de Cadastro/Edição de Veículo */}
      <VehicleModal />
      
      <main className="page-content animate-slide-up">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;
