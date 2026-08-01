import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Shield, CheckCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import './Auth.css';

const Auth = () => {
  const { criarConta, login, authError } = useUser();
  const navigate = useNavigate();

  const [mode, setMode] = useState('entrar'); // 'entrar' | 'criar'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const formatCpf = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = mode === 'criar'
      ? await criarConta(name, email, password, cpf)
      : await login(email, password);
    setSubmitting(false);
    if (ok) navigate('/');
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

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === 'entrar' ? 'active' : ''}
            onClick={() => setMode('entrar')}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'criar' ? 'active' : ''}
            onClick={() => setMode('criar')}
          >
            Criar conta
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'criar' && (
            <>
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="CPF (só números)"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                maxLength={14}
                required
              />
              <p className="auth-hint">Usamos o CPF só pra garantir que cada pessoa tenha direito a um período de teste — não compartilhamos com ninguém.</p>
            </>
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          {authError && <p className="auth-error">{authError}</p>}

          <button type="submit" className="btn-auth-submit" disabled={submitting}>
            {submitting ? 'Aguarde...' : mode === 'criar' ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer">
          <Shield size={14} />
          <span>Seus dados ficam salvos com segurança, vinculados à sua conta.</span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
