import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield, CheckCircle, Smartphone, ArrowRight } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './Auth.css';

const Auth = () => {
  const { loginWithGoogle } = useUser();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    loginWithGoogle();
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <Bot size={36} className="logo-icon" />
          </div>
          <h1>Motor IA</h1>
          <p className="auth-subtitle">Consultoria de IA & Manutenção Preventiva para Motoristas e Entregadores</p>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <CheckCircle size={18} className="feat-icon" />
            <span><strong>Conta 100% Online:</strong> Seus dados salvos com segurança na nuvem.</span>
          </div>

          <div className="feature-item">
            <CheckCircle size={18} className="feat-icon" />
            <span><strong>Diagnóstico por IA:</strong> Alertas de óleo, pneus e radiador para seu carro ou moto.</span>
          </div>

          <div className="feature-item">
            <CheckCircle size={18} className="feat-icon" />
            <span><strong>Lucro Líquido Real:</strong> Saiba exatamente quanto sobrou no bolso.</span>
          </div>
        </div>

        <div className="auth-actions">
          <button className="btn-google-login" onClick={handleGoogleLogin}>
            <svg className="google-svg" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Validar & Entrar com a Conta do Google</span>
          </button>
        </div>

        <div className="auth-footer">
          <Shield size={14} />
          <span>Acesso rápido e seguro via OAuth 2.0 Google</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
