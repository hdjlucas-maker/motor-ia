import React, { createContext, useState, useContext, useEffect } from 'react';
import { useUser } from './UserContext';
import { listarTransacoes, criarTransacao } from '../services/api';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Carrega os lançamentos do usuário logado assim que ele é identificado
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }
    setLoadingTransactions(true);
    listarTransacoes()
      .then(setTransactions)
      .catch(() => setTransactions([]))
      .finally(() => setLoadingTransactions(false));
  }, [user]);

  const addTransaction = async (transaction) => {
    // mantém compatibilidade com quem já chama addTransaction({..., title})
    const { title, ...rest } = transaction;
    const payload = { ...rest, note: transaction.note || title || null };

    // Atualização otimista: mostra na hora, sincroniza com o servidor em seguida
    const tempId = `temp-${Date.now()}`;
    const optimistic = { id: tempId, ...payload };
    setTransactions(prev => [optimistic, ...prev]);

    try {
      const saved = await criarTransacao(payload);
      setTransactions(prev => prev.map(t => (t.id === tempId ? saved : t)));
    } catch (err) {
      // Se der erro (ex: sessão expirou), desfaz a linha otimista
      setTransactions(prev => prev.filter(t => t.id !== tempId));
      throw err;
    }
  };

  const getTodayMetrics = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTransactions = transactions.filter(t => t.date === today);

    const gross = todayTransactions
      .filter(t => t.type === 'ganho')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expenses = todayTransactions
      .filter(t => t.type === 'gasto')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      gross,
      expenses,
      net: gross - expenses
    };
  };

  return (
    <FinanceContext.Provider value={{ transactions, loadingTransactions, addTransaction, getTodayMetrics }}>
      {children}
    </FinanceContext.Provider>
  );
};
