import React, { useState } from 'react';
import { Car, Bike, Check, X, Shield, Sparkles, Gauge, Fuel } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './VehicleModal.css';

const CAR_BRANDS = ['Chevrolet', 'Fiat', 'Volkswagen', 'Hyundai', 'Renault', 'Toyota', 'Honda', 'Ford', 'Nissan', 'Outro'];
const MOTO_BRANDS = ['Honda', 'Yamaha', 'Shineray', 'BMW', 'Royal Enfield', 'Kawasaki', 'Outro'];

const VehicleModal = () => {
  const { vehicleProfile, updateVehicleProfile, showVehicleModal, setShowVehicleModal } = useUser();

  const [type, setType] = useState(vehicleProfile?.type || 'carro');
  const [brand, setBrand] = useState(vehicleProfile?.brand || 'Chevrolet');
  const [model, setModel] = useState(vehicleProfile?.model || 'Onix 1.0 Flex');
  const [year, setYear] = useState(vehicleProfile?.year || '2021');
  const [currentKm, setCurrentKm] = useState(vehicleProfile?.currentKm || 85000);
  const [fuelType, setFuelType] = useState(vehicleProfile?.fuelType || 'Flex (Etanol/Gasolina)');
  const [category, setCategory] = useState(vehicleProfile?.category || 'Uber X / 99Pop');

  if (!showVehicleModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateVehicleProfile({
      type,
      brand,
      model,
      year,
      currentKm: Number(currentKm) || 0,
      fuelType,
      category
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <div className="modal-title-flex">
            <Sparkles className="icon-gold" size={22} />
            <div>
              <h3>Configurar Meu Veículo de Trabalho</h3>
              <p>O Motor IA personalizará todas as revisões e alertas para o seu modelo</p>
            </div>
          </div>
          <button className="btn-close-modal" onClick={() => setShowVehicleModal(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="vehicle-form">
          {/* Seleção do Tipo de Veículo */}
          <div className="form-group">
            <label className="input-label">Selecione o Tipo de Veículo:</label>
            <div className="type-selector">
              <button
                type="button"
                className={`type-card ${type === 'carro' ? 'active' : ''}`}
                onClick={() => {
                  setType('carro');
                  setBrand('Chevrolet');
                  setModel('Onix 1.0 Flex');
                  setFuelType('Flex (Etanol/Gasolina)');
                }}
              >
                <Car size={32} />
                <strong>Carro de Aplicativo</strong>
                <span>Uber, 99, InDrive, Particular</span>
              </button>

              <button
                type="button"
                className={`type-card ${type === 'moto' ? 'active' : ''}`}
                onClick={() => {
                  setType('moto');
                  setBrand('Honda');
                  setModel('CG 160 Titan');
                  setFuelType('Gasolina / Flex');
                }}
              >
                <Bike size={32} />
                <strong>Moto de Entrega / App</strong>
                <span>iFood, Rappi, Uber Flash, Zé Delivery</span>
              </button>
            </div>
          </div>

          {/* Marca e Modelo */}
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Marca do Veículo:</label>
              <select 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                className="select-input"
              >
                {(type === 'carro' ? CAR_BRANDS : MOTO_BRANDS).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Modelo & Versão:</label>
              <input 
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ex: Onix 1.0 / Titan 160"
                className="text-input"
                required
              />
            </div>
          </div>

          {/* Ano e Odômetro */}
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Ano de Fabricação:</label>
              <input 
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2021"
                className="text-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Odômetro Atual (KM):</label>
              <div className="input-icon-wrapper">
                <Gauge size={18} className="input-icon" />
                <input 
                  type="number"
                  value={currentKm}
                  onChange={(e) => setCurrentKm(e.target.value)}
                  placeholder="Ex: 85000"
                  className="text-input with-icon"
                  required
                />
              </div>
            </div>
          </div>

          {/* Combustível e Categoria de Uso */}
          <div className="form-row">
            <div className="form-group">
              <label className="input-label">Combustível Principal:</label>
              <select 
                value={fuelType} 
                onChange={(e) => setFuelType(e.target.value)}
                className="select-input"
              >
                <option value="Flex (Etanol/Gasolina)">Flex (Etanol/Gasolina)</option>
                <option value="Gasolina">Gasolina</option>
                <option value="GNV + Gasolina">GNV + Gasolina</option>
                <option value="Diesel">Diesel</option>
                <option value="Elétrico / Híbrido">Elétrico / Híbrido</option>
              </select>
            </div>

            <div className="form-group">
              <label className="input-label">Categoria de Trabalho:</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="select-input"
              >
                <option value="Uber X / 99Pop">Uber X / 99Pop</option>
                <option value="Uber Comfort / Black">Uber Comfort / Black</option>
                <option value="Entregas iFood / Rappi / Zé">Entregas iFood / Rappi / Zé</option>
                <option value="Motorista Particular">Motorista Particular</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary btn-save-vehicle">
              <Check size={18} />
              <span>Salvar Veículo & Personalizar Motor IA</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
