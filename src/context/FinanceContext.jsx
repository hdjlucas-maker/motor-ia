import React, { createContext, useState, useContext, useEffect } from 'react';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  // Try to load from localStorage first
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('motorIA_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('motorIA_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
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
    <FinanceContext.Provider value={{ transactions, addTransaction, getTodayMetrics }}>
      {children}
    </FinanceContext.Provider>
  );
};
