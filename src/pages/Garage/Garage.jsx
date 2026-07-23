import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, Gauge, AlertTriangle, PlusCircle, CheckCircle, Trash2, RefreshCw, Car, Bike, Settings } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './Garage.css';

const DEFAULT_CAR_PARTS = [
  { id: '1', name: 'Troca de Óleo + Filtro (Carro)', intervalKm: 5000, lastKm: 80000, lastDate: '2026-05-10', cost: 250 },
  { id: '2', name: 'Pastilhas de Freio', intervalKm: 25000, lastKm: 70000, lastDate: '2026-01-15', cost: 180 },
  { id: '3', name: 'Pneus Dianteiros', intervalKm: 40000, lastKm: 50000, lastDate: '2025-08-20', cost: 800 },
  { id: '4', name: 'Filtro de Ar do Motor', intervalKm: 15000, lastKm: 80000, lastDate: '2026-05-10', cost: 60 },
];

const DEFAULT_MOTO_PARTS = [
  { id: 'm1', name: 'Kit Relação (Corrente/Pinhão/Coroa)', intervalKm: 15000, lastKm: 10000, lastDate: '2026-03-01', cost: 220 },
  { id: 'm2', name: 'Troca de Óleo de Motor 4T', intervalKm: 2000, lastKm: 24000, lastDate: '2026-06-12', cost: 45 },
  { id: 'm3', name: 'Lubrificação da Corrente', intervalKm: 500, lastKm: 25200, lastDate: '2026-07-10', cost: 15 },
  { id: 'm4', name: 'Pastilhas e Lonas de Freio', intervalKm: 10000, lastKm: 20000, lastDate: '2026-02-15', cost: 90 },
];

const Garage = () => {
  const { vehicleProfile, updateKm, setShowVehicleModal } = useUser();

  const currentKm = vehicleProfile?.currentKm || 85000;
  const isMoto = vehicleProfile?.type === 'moto';

  const [maintenances, setMaintenances] = useState(() => {
    const saved = localStorage.getItem('motorIA_maintenances');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler manutenções do localStorage:', e);
      }
    }
    return isMoto ? DEFAULT_MOTO_PARTS : DEFAULT_CAR_PARTS;
  });

  const [showForm, setShowForm] = useState(false);
  
  // State do Formulário
  const [serviceName, setServiceName] = useState(isMoto ? 'Troca de Óleo de Motor 4T' : 'Troca de Óleo + Filtro (Carro)');
  const [serviceKm, setServiceKm] = useState(currentKm);
  const [intervalKm, setIntervalKm] = useState(isMoto ? 2000 : 5000);
  const [cost, setCost] = useState('');
  const [workshop, setWorkshop] = useState('');

  useEffect(() => {
    localStorage.setItem('motorIA_maintenances', JSON.stringify(maintenances));
  }, [maintenances]);

  const handleKmChange = (newVal) => {
    const kmNum = Number(newVal) || 0;
    updateKm(kmNum);
  };

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
    if (window.confirm('Tem certeza que deseja remover esta peça da lista?')) {
      setMaintenances(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleConfirmReplacement = (id) => {
    if (window.confirm('Confirmar manutenção? A quilometragem da peça será atualizada para o odômetro atual!')) {
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
      {/* Header do Veículo Registrado */}
      <div className="vehicle-banner glass-panel">
        <div className="banner-left">
          <div className="banner-icon">
            {isMoto ? <Bike size={32} className="icon-gold" /> : <Car size={32} className="icon-blue" />}
          </div>
          <div>
            <h3>{vehicleProfile?.brand} {vehicleProfile?.model}</h3>
            <p>Ano: {vehicleProfile?.year} • Combustível: {vehicleProfile?.fuelType} • {vehicleProfile?.category}</p>
          </div>
        </div>

        <button className="btn-edit-vehicle" onClick={() => setShowVehicleModal(true)}>
          <Settings size={16} />
          <span>Alterar Veículo</span>
        </button>
      </div>

      {/* Odometer Update Card */}
      <div className="odometer-card glass-panel">
        <div className="odometer-info">
          <Gauge size={24} className="icon-green" />
          <div>
            <span className="odometer-label">Quilometragem Atual do Odômetro</span>
            <div className="odometer-input-wrapper">
              <input 
                type="number" 
                value={currentKm} 
                onChange={(e) => handleKmChange(e.target.value)}
                className="odometer-input" 
              />
              <span className="km-unit">KM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <h3>Plano de Manutenção Preventiva</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={16} />
          {showForm ? 'Fechar' : 'Nova Manutenção'}
        </button>
      </div>

      {/* Form de Manutenção */}
      {showForm && (
        <div className="form-container glass-panel animate-slide-up">
          <form className="service-form" onSubmit={handleAddService}>
            <div className="form-group">
              <label>Peça ou Serviço</label>
              {isMoto ? (
                <select className="form-input" value={serviceName} onChange={e => setServiceName(e.target.value)}>
                  <option value="Troca de Óleo de Motor 4T">Troca de Óleo de Motor 4T</option>
                  <option value="Kit Relação (Corrente/Pinhão/Coroa)">Kit Relação (Corrente/Pinhão/Coroa)</option>
                  <option value="Lubrificação da Corrente">Lubrificação da Corrente</option>
                  <option value="Pastilhas e Lonas de Freio">Pastilhas e Lonas de Freio</option>
                  <option value="Pneu Traseiro / Dianteiro">Pneu Traseiro / Dianteiro</option>
                  <option value="Cabo de Embreagem/Freio">Cabo de Embreagem/Freio</option>
                  <option value="Vela de Ignição Moto">Vela de Ignição Moto</option>
                </select>
              ) : (
                <select className="form-input" value={serviceName} onChange={e => setServiceName(e.target.value)}>
                  <option value="Troca de Óleo + Filtro (Carro)">Troca de Óleo + Filtro (Carro)</option>
                  <option value="Pastilhas de Freio">Pastilhas de Freio</option>
                  <option value="Filtro de Ar do Motor">Filtro de Ar do Motor</option>
                  <option value="Pneus">Pneus</option>
                  <option value="Embreagem">Embreagem</option>
                  <option value="Suspensão">Suspensão</option>
                  <option value="Velas de Ignição">Velas de Ignição</option>
                  <option value="Correia Dentada">Correia Dentada</option>
                  <option value="Bateria">Bateria</option>
                </select>
              )}
            </div>

            <div className="form-group">
              <label>KM no momento da troca</label>
              <input type="number" value={serviceKm} onChange={e => setServiceKm(e.target.value)} className="form-input" required />
            </div>

            <div className="form-group">
              <label>Trocar a cada quantos KM?</label>
              <input type="number" value={intervalKm} onChange={e => setIntervalKm(e.target.value)} placeholder="Ex: 5000" className="form-input" required />
            </div>

            <div className="form-group">
              <label>Valor Pago (R$)</label>
              <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="0.00" step="0.01" className="form-input" required />
            </div>

            <div className="form-group">
              <label>Nome da Oficina (Opcional)</label>
              <input type="text" value={workshop} onChange={e => setWorkshop(e.target.value)} placeholder="Ex: Oficina Mecânica" className="form-input" />
            </div>

            <button type="submit" className="btn btn-primary submit-btn">Salvar Manutenção</button>
          </form>
        </div>
      )}

      {/* Lista de Manutenções */}
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
