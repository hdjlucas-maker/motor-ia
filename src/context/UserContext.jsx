import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const DEFAULT_VEHICLE = {
  type: 'carro', // 'carro' ou 'moto'
  brand: 'Chevrolet',
  model: 'Onix 1.0 Flex',
  year: '2021',
  currentKm: 85000,
  fuelType: 'Flex (Etanol/Gasolina)',
  category: 'Uber X / 99Pop'
};

const DEFAULT_USER = {
  id: 'google-user-123',
  name: 'Motorista Parceiro',
  email: 'motorista@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
  isAuthenticated: true
};

export const UserProvider = ({ children }) => {
  // Estado do Usuário Autenticado via Google
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('motorIA_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  // Perfil do Veículo (Carro ou Moto, Ano, Modelo, Odômetro)
  const [vehicleProfile, setVehicleProfile] = useState(() => {
    const saved = localStorage.getItem('motorIA_vehicle');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLE;
  });

  // Modal de Cadastro/Edição de Veículo
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('motorIA_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('motorIA_user');
    }
  }, [user]);

  useEffect(() => {
    if (vehicleProfile) {
      localStorage.setItem('motorIA_vehicle', JSON.stringify(vehicleProfile));
      localStorage.setItem('motorIA_currentKm', vehicleProfile.currentKm.toString());
    }
  }, [vehicleProfile]);

  const loginWithGoogle = (googleUserData = null) => {
    const userData = googleUserData || {
      id: `google-user-${Date.now()}`,
      name: 'Lucas Motorista',
      email: 'hdjlucas@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isAuthenticated: true
    };
    setUser(userData);
    setShowVehicleModal(true); // Abre modal de veículo se necessário
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('motorIA_user');
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
      vehicleProfile,
      showVehicleModal,
      setShowVehicleModal,
      loginWithGoogle,
      logout,
      updateVehicleProfile,
      updateKm
    }}>
      {children}
    </UserContext.Provider>
  );
};
