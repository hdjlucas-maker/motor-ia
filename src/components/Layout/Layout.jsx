import React from 'react';
import { Outlet } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import BottomNav from './BottomNav';
import './Layout.css';

const Layout = () => {
  const handleResetData = () => {
    const confirmMessage = "⚠️ ATENÇÃO: Esta ação apagara TODOS os dados de corridas, despesas e manutenções do seu aplicativo (útil caso tenha trocado de veículo).\n\nTem certeza absoluta que deseja ZERAR tudo?";
    
    if (window.confirm(confirmMessage)) {
      localStorage.clear();
      alert("✅ Todos os dados foram zerados com sucesso! O aplicativo será recarregado.");
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
        <button 
          className="reset-btn" 
          title="Zerar dados (Troca de Carro)"
          onClick={handleResetData}
        >
          <RotateCcw size={18} />
        </button>
      </header>
      
      <main className="page-content animate-slide-up">
        <Outlet />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Layout;
