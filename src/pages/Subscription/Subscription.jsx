import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useSubscription } from '../../hooks/useSubscription';
import './Subscription.css';

const Subscription = () => {
  const { user } = useUser();
  const { status, daysLeft, plan, error, checkoutLoading, refresh, startCheckout } = useSubscription(user?.id);
  const [searchParams] = useSearchParams();
  const [confirming, setConfirming] = useState(false);

  // Quando o usuário volta do checkout da InfinitePay (?paid=1), o webhook pode levar
  // alguns segundos para processar. Tenta atualizar o status algumas vezes.
  useEffect(() => {
    if (searchParams.get('paid') !== '1') return;

    setConfirming(true);
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      await refresh();
      if (attempts >= 6) {
        clearInterval(interval);
        setConfirming(false);
      }
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (status === 'active' && confirming) {
      setConfirming(false);
    }
  }, [status, confirming]);

  return (
    <div className="subscription-page">
      <div className="sub-header">
        <Sparkles size={28} className="sub-header-icon" />
        <h1>Motor IA Premium</h1>
        <p>Consultoria completa de manutenção e finanças, sem limites.</p>
      </div>

      {confirming && (
        <div className="sub-banner sub-banner-info">
          <Clock size={16} />
          <span>Confirmando seu pagamento com a InfinitePay... isso pode levar alguns segundos.</span>
        </div>
      )}

      {status === 'active' && (
        <div className="sub-banner sub-banner-success">
          <CheckCircle size={16} />
          <span>
            Assinatura ativa ({plan === 'yearly' ? 'plano anual' : 'plano mensal'}) — restam {daysLeft} dia(s).
          </span>
        </div>
      )}

      {status === 'trial' && (
        <div className="sub-banner sub-banner-warning">
          <Clock size={16} />
          <span>Você está no período de teste gratuito: restam {daysLeft} dia(s).</span>
        </div>
      )}

      {status === 'expired' && (
        <div className="sub-banner sub-banner-danger">
          <Clock size={16} />
          <span>Seu período de teste acabou. Assine para continuar usando o Motor IA.</span>
        </div>
      )}

      {error && (
        <div className="sub-banner sub-banner-danger">
          <span>Ocorreu um erro: {error}</span>
        </div>
      )}

      {status !== 'active' && (
        <div className="sub-plans">
          <div className="sub-plan-card">
            <h3>Mensal</h3>
            <div className="sub-plan-price">
              R$ 19,99<span>/mês</span>
            </div>
            <ul>
              <li><CheckCircle size={14} /> IA de manutenção ilimitada</li>
              <li><CheckCircle size={14} /> Controle financeiro completo</li>
              <li><CheckCircle size={14} /> Relatórios em Excel/PDF</li>
            </ul>
            <button
              className="sub-plan-btn"
              disabled={checkoutLoading}
              onClick={() => startCheckout('monthly')}
            >
              {checkoutLoading ? 'Redirecionando...' : 'Assinar Mensal'}
            </button>
          </div>

          <div className="sub-plan-card sub-plan-highlight">
            <div className="sub-plan-badge">Mais econômico</div>
            <h3>Anual</h3>
            <div className="sub-plan-price">
              R$ 129,99<span>/ano</span>
            </div>
            <p className="sub-plan-savings">Equivale a R$ 10,83/mês</p>
            <ul>
              <li><CheckCircle size={14} /> IA de manutenção ilimitada</li>
              <li><CheckCircle size={14} /> Controle financeiro completo</li>
              <li><CheckCircle size={14} /> Relatórios em Excel/PDF</li>
            </ul>
            <button
              className="sub-plan-btn sub-plan-btn-primary"
              disabled={checkoutLoading}
              onClick={() => startCheckout('yearly')}
            >
              {checkoutLoading ? 'Redirecionando...' : 'Assinar Anual'}
            </button>
          </div>
        </div>
      )}

      <div className="sub-footer">
        <ShieldCheck size={14} />
        <span>Pagamento processado com segurança pela InfinitePay (Pix ou cartão)</span>
      </div>
    </div>
  );
};

export default Subscription;
