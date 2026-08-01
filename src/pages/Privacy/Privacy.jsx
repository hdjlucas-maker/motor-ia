import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import './Privacy.css';

const Privacy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-card glass-panel">
        <Link to="/auth" className="privacy-back">
          <ArrowLeft size={16} />
          <span>Voltar</span>
        </Link>

        <div className="privacy-header">
          <Shield size={28} className="icon-gold" />
          <h1>Privacidade e Uso de Dados</h1>
        </div>

        <p className="privacy-updated">Última atualização: Agosto de 2026</p>

        <section>
          <h2>Quais dados coletamos</h2>
          <ul>
            <li><strong>Cadastro:</strong> nome, e-mail e senha (a senha nunca é guardada em texto puro, só um hash irreversível).</li>
            <li><strong>CPF:</strong> usado exclusivamente para garantir que cada pessoa tenha direito a um único período de teste gratuito. Guardamos apenas um hash do CPF (não o número em texto puro), então não conseguimos "ver" seu CPF de volta a partir do banco.</li>
            <li><strong>Dados financeiros que você mesmo lança:</strong> ganhos, gastos e categorias que você digita no app, pra calcular seu lucro líquido.</li>
            <li><strong>Dados do veículo:</strong> marca, modelo, ano e quilometragem, usados só para personalizar os alertas de manutenção.</li>
          </ul>
        </section>

        <section>
          <h2>O que NÃO fazemos</h2>
          <ul>
            <li>Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais.</li>
            <li>Não usamos seus dados financeiros para nada além de mostrar pra você mesmo dentro do app.</li>
          </ul>
        </section>

        <section>
          <h2>Onde seus dados ficam armazenados</h2>
          <p>Os dados ficam em um banco de dados (Cloudflare D1), protegido por senha com hash e sessão segura (cookie httpOnly). O processamento da IA de consultoria usa o Cloudflare Workers AI, que não reutiliza suas perguntas para treinar outros modelos publicamente.</p>
        </section>

        <section>
          <h2>Seus direitos (LGPD)</h2>
          <p>Você pode pedir a exclusão total da sua conta e dos seus dados a qualquer momento. Basta enviar essa solicitação pelo contato abaixo.</p>
        </section>

        <section>
          <h2>Contato</h2>
          <p>Dúvidas sobre seus dados ou pedidos de exclusão: entre em contato através do desenvolvedor responsável (veja abaixo).</p>
        </section>

        <div className="privacy-credit">
          Motor IA foi desenvolvido por{' '}
          <a href="https://lucascorrea-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer">
            Lucas.dev
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
