import { useState, useEffect, useCallback } from 'react';

// status possíveis: 'loading' | 'trial' | 'active' | 'expired' | 'error'
export function useSubscription(userId) {
  const [status, setStatus] = useState('loading');
  const [daysLeft, setDaysLeft] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setStatus((prev) => (prev === 'loading' ? prev : prev));
    try {
      const res = await fetch('/api/subscription-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao verificar assinatura');
        setStatus('error');
        return;
      }

      setStatus(data.status);
      setDaysLeft(data.daysLeft ?? null);
      setPlan(data.plan ?? null);
      setError(null);
    } catch (err) {
      setError(String(err));
      setStatus('error');
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const startCheckout = useCallback(
    async (selectedPlan) => {
      if (!userId) return;
      setCheckoutLoading(true);
      try {
        const res = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, plan: selectedPlan }),
        });
        const data = await res.json();

        if (!res.ok || !data.checkoutUrl) {
          throw new Error(data.error || 'Não foi possível iniciar o pagamento');
        }

        window.location.href = data.checkoutUrl;
      } catch (err) {
        setError(String(err));
        setCheckoutLoading(false);
      }
    },
    [userId]
  );

  return {
    status,       // 'loading' | 'trial' | 'active' | 'expired' | 'error'
    daysLeft,
    plan,
    error,
    checkoutLoading,
    refresh,
    startCheckout,
  };
}

export default useSubscription;
