import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, Gauge, AlertTriangle, PlusCircle, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import './Garage.css';

const DEFAULT_PARTS = [
  { id: '1', name: 'Troca de Óleo + Filtro', intervalKm: 10000, lastKm: 80000, lastDate: '2026-05-10', cost: 250 },
  { id: '2', name: 'Pastilhas de Freio', intervalKm: 25000, lastKm: 70000, lastDate: '2026-01-15', cost: 180 },
  { id: '3', name: 'Pneus Dianteiros', intervalKm: 40000, lastKm: 50000, lastDate: '2025-08-20', cost: 800 },
  { id: '4', name: 'Filtro de Ar do Motor', intervalKm: 15000, lastKm: 80000, lastDate: '2026-05-10', cost: 60 },
];

const Garage = () => {
  const [currentKm, setCurrentKm] = useState(() => {
    return Number(localStorage.getItem('motorIA_currentKm')) || 85000;
  });

  const [maintenances, setMaintenances] = useState(() => {
    const saved = localStorage.getItem('motorIA_maintenances');
    return saved ? JSON.parse(saved) : DEFAULT_PARTS;
  });

  const [showForm, setShowForm] = useState(false);
  
  // New Service Form State
  const [serviceName, setServiceName] = useState('Troca de Óleo + Filtro');
  const [serviceKm, setServiceKm] = useState(currentKm);
  const [intervalKm, setIntervalKm] = useState(10000);
  const [cost, setCost] = useState('');
  const [workshop, setWorkshop] = useState('');

  useEffect(() => {
    localStorage.setItem('motorIA_currentKm', currentKm.toString());
  }, [currentKm]);

  useEffect(() => {
    localStorage.setItem('motorIA_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  const handleAddService = (e) => {
    e.preventDefault();
    if (!serviceName || !cost) return;

    const newService = {
      id: Date.now().toString(),
      name: serviceName,
      lastKm: Number(serviceKm),
      intervalKm: Number(intervalKm),
      lastDate: new Date().toISOString().split('T')[0],
      cost: Number(cost),
      workshop: workshop || 'Oficina Geral'
    };

    setMaintenances(prev => [newService, ...prev.filter(item => item.name !== serviceName)]);
    setShowForm(false);
    setCost('');
    setWorkshop('');
  };

  const handleDeletePart = (id) => {
    if (window.confirm('Tem certeza que deseja remover esta peça/serviço da lista?')) {
      setMaintenances(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleConfirmReplacement = (id) => {
    if (window.confirm('Confirmar troca? A quilometragem da peça será atualizada para o KM atual do seu carro!')) {
      const today = new Date().toISOString().split('T')[0];
      setMaintenances(prev => prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            lastKm: currentKm,
            lastDate: today
          };
        }
        return item;
      }));
    }
  };

  return (
    <div className="garage-container">
      <div className="page-header">
        <h2>Garagem & Manutenção</h2>
        <p>Acompanhe a saúde do seu veículo</p>
      </div>

      {/* Odometer Update Card */}
      <div className="odometer-card glass-panel">
        <div className="odometer-info">
          <Gauge size={24} className="icon-green" />
          <div>
            <span className="odometer-label">Quilometragem Atual</span>
            <div className="odometer-input-wrapper">
              <input 
                type="number" 
                value={currentKm} 
                onChange={(e) => setCurrentKm(Number(e.target.value))}
                className="odometer-input" 
              />
              <span className="km-unit">KM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <h3>Peças & Serviços</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={16} />
          {showForm ? 'Fechar' : 'Novo Serviço'}
        </button>
      </div>

      {/* Service Form */}
      {showForm && (
        <div className="form-container glass-panel animate-slide-up">
          <form className="service-form" onSubmit={handleAddService}>
            <div className="form-group">
              <label>Peça ou Serviço</label>
              <select className="form-input" value={serviceName} onChange={e => setServiceName(e.target.value)}>
                <option value="Troca de Óleo + Filtro">Troca de Óleo + Filtro</option>
                <option value="Pastilhas de Freio">Pastilhas de Freio</option>
                <option value="Filtro de Ar">Filtro de Ar</option>
                <option value="Pneus">Pneus</option>
                <option value="Embreagem">Embreagem</option>
                <option value="Suspensão">Suspensão</option>
                <option value="Velas de Ignição">Velas de Ignição</option>
                <option value="Correia Dentada">Correia Dentada</option>
                <option value="Bateria">Bateria</option>
              </select>
            </div>

            <div className="form-group">
              <label>KM no momento da troca</label>
              <input type="number" value={serviceKm} onChange={e => setServiceKm(e.target.value)} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Trocar a cada quantos KM?</label>
              <input type="number" value={intervalKm} onChange={e => setIntervalKm(e.target.value)} placeholder="Ex: 10000" className="form-input" required />
            </div>

            <div className="form-group">
              <label>Valor Pago (R$)</label>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" step="0.01" className="form-input" required />
            </div>

            <div className="form-group">
              <label>Nome da Oficina (Opcional)</label>
              <input type="text" value={workshop} onChange={e => setWorkshop(e.target.value)} placeholder="Ex: Auto Center Silva" className="form-input" />
            </div>

            <button type="submit" className="btn btn-primary submit-btn">Salvar Manutenção</button>
          </form>
        </div>
      )}

      {/* Maintenance List */}
      <div className="parts-list">
        {maintenances.map(part => {
          const nextKm = part.lastKm + part.intervalKm;
          const remainingKm = nextKm - currentKm;
          const isUrgent = remainingKm <= 1000;
          const isOverdue = remainingKm < 0;

          return (
            <div key={part.id} className={`part-card glass-panel ${isOverdue ? 'overdue' : isUrgent ? 'urgent' : ''}`}>
              <div className="part-header">
                <div className="part-title">
                  <Wrench size={18} className="part-icon" />
                  <h4>{part.name}</h4>
                </div>
                {isOverdue ? (
                  <span className="badge danger">VENCIDO!</span>
                ) : isUrgent ? (
                  <span className="badge warning">Troca Próxima</span>
                ) : (
                  <span className="badge success">Em dia</span>
                )}
              </div>

              <div className="part-body">
                <div className="part-info">
                  <span className="info-label">Última Troca:</span>
                  <span className="info-value">{part.lastKm.toLocaleString('pt-BR')} KM ({part.lastDate})</span>
                </div>
                <div className="part-info">
                  <span className="info-label">Próxima Troca:</span>
                  <span className="info-value">{nextKm.toLocaleString('pt-BR')} KM</span>
                </div>
              </div>

              <div className="part-footer">
                <span className="remaining-km">
                  {isOverdue 
                    ? `Passou ${Math.abs(remainingKm).toLocaleString('pt-BR')} KM da troca`
                    : `Faltam ${remainingKm.toLocaleString('pt-BR')} KM`}
                </span>
                <div className="part-actions">
                  <button 
                    className="action-btn confirm-btn" 
                    title="Confirmar Troca (Renovar)"
                    onClick={() => handleConfirmReplacement(part.id)}
                  >
                    <RefreshCw size={14} /> Renovar
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    title="Excluir Peça"
                    onClick={() => handleDeletePart(part.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Garage;
