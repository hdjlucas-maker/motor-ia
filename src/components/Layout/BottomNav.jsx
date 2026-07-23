import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wallet, Wrench, Bot, FileSpreadsheet } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <Home size={24} />
        <span>Resumo</span>
      </NavLink>
      
      <NavLink to="/financial" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Wallet size={24} />
        <span>Finanças</span>
      </NavLink>
      
      <NavLink to="/garage" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Wrench size={24} />
        <span>Garagem</span>
      </NavLink>
      
      <NavLink to="/ai" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="ai-icon-wrapper">
          <Bot size={28} />
        </div>
        <span>Motor IA</span>
      </NavLink>

      <NavLink to="/reports" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileSpreadsheet size={24} />
        <span>Relatórios</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
