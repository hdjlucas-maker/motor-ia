import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useSubscription } from '../../hooks/useSubscription';

const RequireSubscription = ({ children }) => {
  const { user } = useUser();
  const { status } = useSubscription(user?.id);

  if (status === 'loading') {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
        Carregando...
      </div>
    );
  }

  if (status === 'expired') {
    return <Navigate to="/subscription" replace />;
  }

  // 'trial', 'active', ou 'error' (nesse caso não bloqueia, para não travar o app por falha de rede)
  return children;
};

export default RequireSubscription;
