import React, { createContext, useState, useContext, useEffect } from 'react';
import { registrar, entrar, sair, buscarUsuarioLogado } from '../services/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const DEFAULT_VEHICLE = {
  type: 'carro', // 'carro' ou 'moto'
  brand: '',
  model: '',
  year: '',
  currentKm: 0,
  fuelType: '',
  category: ''
};

export const UserProvider = ({ children }) => {
  // Usuário autenticado de verdade (sessão no banco D1, cookie httpOnly)
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [authError, setAuthError] = useState('');

  // Perfil do veículo continua local por enquanto (próximo passo: migrar pra tabela `vehicles`)
  const [vehicleProfile, setVehicleProfile] = useState(() => {
    const saved = localStorage.getItem('motorIA_vehicle');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLE;
  });

  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Ao abrir o app, verifica se já existe uma sessão válida (cookie httpOnly)
  useEffect(() => {
    (async () => {
      try {
        const loggedUser = await buscarUsuarioLogado();
        setUser(loggedUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (vehicleProfile) {
      localStorage.setItem('motorIA_vehicle', JSON.stringify(vehicleProfile));
      localStorage.setItem('motorIA_currentKm', vehicleProfile.currentKm.toString());
    }
  }, [vehicleProfile]);

  const criarConta = async (name, email, password) => {
    setAuthError('');
    try {
      const newUser = await registrar(name, email, password);
      setUser(newUser);
      setShowVehicleModal(true);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  };

  const login = async (email, password) => {
    setAuthError('');
    try {
      const loggedUser = await entrar(email, password);
      setUser(loggedUser);
      return true;
    } catch (err) {
      setAuthError(err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await sair();
    } finally {
      setUser(null);
    }
  };

  const updateVehicleProfile = (newProfile) => {
    setVehicleProfile(prev => ({
      ...prev,
      ...newProfile
    }));
    setShowVehicleModal(false);
  };

  const updateKm = (newKm) => {
    const kmNum = Number(newKm) || 0;
    setVehicleProfile(prev => ({
      ...prev,
      currentKm: kmNum
    }));
  };

  return (
    <UserContext.Provider value={{
      user,
      loadingUser,
      authError,
      vehicleProfile,
      showVehicleModal,
      setShowVehicleModal,
      criarConta,
      login,
      logout,
      updateVehicleProfile,
      updateKm
    }}>
      {children}
    </UserContext.Provider>
  );
};
