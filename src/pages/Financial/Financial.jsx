import React, { useState } from 'react';
import { PlusCircle, MinusCircle, Wallet, ArrowRightLeft } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import './Financial.css';

const Financial = () => {
  const { transactions, addTransaction } = useFinance();
  const [activeTab, setActiveTab] = useState('ganhos'); // 'ganhos' | 'gastos'
  
  // Form States
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('uber'); // Or 'combustivel' for expenses
  
  const handleAddTransaction = (e, type) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) return;
    
    addTransaction({
      type,
      amount: Number(amount),
      date,
      category,
      title: type === 'ganho' ? `Corrida ${category}` : category,
    });
    
    setAmount('');
  };

  return (
    <div className="financial-container">
      <div className="page-header">
        <h2>Controle Financeiro</h2>
        <p>Registre seus ganhos e despesas</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'ganhos' ? 'active' : ''}`}
          onClick={() => setActiveTab('ganhos')}
        >
          <PlusCircle size={18} />
          Ganhos
        </button>
        <button 
          className={`tab-btn ${activeTab === 'gastos' ? 'active' : ''}`}
          onClick={() => setActiveTab('gastos')}
        >
          <MinusCircle size={18} />
          Despesas
        </button>
      </div>

      <div className="form-container glass-panel animate-slide-up">
        {activeTab === 'ganhos' ? (
          <form className="finance-form" onSubmit={(e) => handleAddTransaction(e, 'ganho')}>
            <div className="form-group">
              <label>Aplicativo</label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Uber">Uber</option>
                <option value="99">99</option>
                <option value="InDrive">InDrive</option>
                <option value="Particular">Particular</option>
              </select>
            </div>
            <div className="form-group">
              <label>Valor (R$)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" required />
            </div>
            <button type="submit" className="btn btn-primary submit-btn">Registrar Ganho</button>
          </form>
        ) : (
          <form className="finance-form" onSubmit={(e) => handleAddTransaction(e, 'gasto')}>
            <div className="form-group">
              <label>Categoria de Gasto</label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Combustível">Combustível</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Lavagem">Lavagem</option>
                <option value="Pedágio">Pedágio</option>
                <option value="Parcela">Parcela do Carro</option>
                <option value="Cartão">Cartão de Crédito</option>
              </select>
            </div>
            <div className="form-group">
              <label>Valor (R$)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" step="0.01" className="form-input" required />
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input" required />
            </div>
            <button type="submit" className="btn btn-danger submit-btn">Registrar Gasto</button>
          </form>
        )}
      </div>

      <div className="recent-transactions">
        <h3>Lançamentos Recentes</h3>
        <div className="transaction-list">
          {transactions.length === 0 && (
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>Nenhum lançamento recente.</p>
          )}
          {transactions.slice(0, 10).map((t) => (
            <div key={t.id} className="transaction-item glass-panel">
              <div className={`t-icon ${t.type === 'ganho' ? 'uber' : 'gas'}`}>
                {t.type === 'ganho' ? <Wallet size={20} /> : <ArrowRightLeft size={20} />}
              </div>
              <div className="t-details">
                <span className="t-title">{t.title}</span>
                <span className="t-date">{t.date}</span>
              </div>
              <span className={`t-amount ${t.type === 'ganho' ? 'success' : 'danger'}`}>
                {t.type === 'ganho' ? '+' : '-'} R$ {t.amount.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Financial;
