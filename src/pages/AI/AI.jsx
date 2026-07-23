import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, HelpCircle, ChevronDown, ChevronUp, Search, Car, Bike, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { processQuery } from '../../ai/assistant';
import { MAINTENANCE_FAQ_CATEGORIES, FAQ_ITEMS, searchFAQ } from '../../ai/knowledgeBase';
import './AI.css';

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'ai',
  text: 'Olá! Sou a Motor IA, sua consultora pessoal de faturamento, manutenção (carro e moto) e suporte ao aplicativo.\n\nEstou conectada ao seu financeiro e à sua garagem em tempo real. Como posso te ajudar hoje?',
  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
};

// Formata texto com marcação simples (**negrito**, quebras de linha e tópicos)
const FormattedText = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="formatted-text">
      {lines.map((line, lineIdx) => {
        if (!line.trim()) return <div key={lineIdx} className="spacer" />;

        // Processa negrito **texto**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const renderedParts = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        return (
          <p key={lineIdx} className={line.startsWith('•') || line.startsWith('-') ? 'bullet-line' : ''}>
            {renderedParts}
          </p>
        );
      })}
    </div>
  );
};

const AI = () => {
  const { transactions } = useFinance();

  // Histórico de mensagens do localStorage ou mensagem padrão
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('motorIA_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler histórico do chat:', e);
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [faqSearch, setFaqSearch] = useState('');

  const chatEndRef = useRef(null);

  // Telemetria da Garagem
  const currentKm = Number(localStorage.getItem('motorIA_currentKm')) || 85000;
  const maintenances = (() => {
    const saved = localStorage.getItem('motorIA_maintenances');
    return saved ? JSON.parse(saved) : [];
  })();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    localStorage.setItem('motorIA_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleClearHistory = () => {
    if (window.confirm('Deseja realmente apagar o histórico dessa conversa?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('motorIA_chat_history');
    }
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const replyText = await processQuery({
        userQuery: query,
        transactions,
        currentKm,
        maintenances
      });

      const aiReply = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error("Erro ao gerar resposta da IA:", err);
      const errorReply = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Desculpe, ocorreu um pequeno contratempo ao analisar seus dados. Por favor, tente novamente!",
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  // Filtragem de perguntas do FAQ
  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCat) return false;

    if (!faqSearch.trim()) return true;

    const searchLower = faqSearch.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const qLower = item.question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const aLower = item.answer.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const kwLower = item.keywords.some(kw => kw.includes(searchLower));

    return qLower.includes(searchLower) || aLower.includes(searchLower) || kwLower;
  });

  const handleSelectFaqQuestion = (question) => {
    setShowFaqModal(false);
    handleSend(question);
  };

  return (
    <div className="ai-container">
      {/* Header com Ações Rápidas */}
      <div className="page-header header-ai-flex">
        <div>
          <div className="header-title-ai">
            <Sparkles className="icon-sparkle" size={22} />
            <h2>Motor IA</h2>
          </div>
          <p>Consultoria financeira, mecânica & Central de Suporte</p>
        </div>

        <div className="ai-header-actions">
          <button 
            className={`btn-faq-toggle ${showFaqModal ? 'active' : ''}`}
            onClick={() => setShowFaqModal(!showFaqModal)}
          >
            <HelpCircle size={18} />
            <span>Central de FAQ & Suporte</span>
            {showFaqModal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button 
            className="btn-icon-ai danger" 
            title="Limpar Conversa"
            onClick={handleClearHistory}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Painel Expansível de FAQ & Suporte */}
      {showFaqModal && (
        <div className="faq-panel glass-panel">
          <div className="faq-panel-header">
            <h3>📖 Central de Dúvidas Frequentes & Manutenção</h3>
            <p>Selecione uma categoria ou busque por qualquer dúvida sobre seu carro, moto ou uso do app:</p>
          </div>

          {/* Busca no FAQ */}
          <div className="faq-search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por óleo, radiador, relação de moto, Uber, freio..." 
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="faq-search-input"
            />
          </div>

          {/* Categorias */}
          <div className="faq-categories">
            <button 
              className={`cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              🔥 Todas ({FAQ_ITEMS.length})
            </button>
            {MAINTENANCE_FAQ_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                className={`cat-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Lista de Perguntas */}
          <div className="faq-items-grid">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(item => (
                <div 
                  key={item.id} 
                  className="faq-card"
                  onClick={() => handleSelectFaqQuestion(item.question)}
                >
                  <div className="faq-card-question">
                    <span className="faq-badge">{item.category.toUpperCase()}</span>
                    <strong>{item.question}</strong>
                  </div>
                  <span className="faq-click-hint">Clique para perguntar à IA ➔</span>
                </div>
              ))
            ) : (
              <div className="faq-empty">
                <p>Nenhuma dúvida encontrada para "{faqSearch}".</p>
                <button className="btn-ask-custom" onClick={() => handleSelectFaqQuestion(faqSearch)}>
                  Perguntar diretamente para Motor IA ➔
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sugestões Rápidas de Atalho */}
      <div className="quick-questions">
        <button className="quick-btn highlighted" onClick={() => handleSend("Para que serve este aplicativo e como ele me ajuda?")} disabled={isTyping}>
          ❓ Para que serve o app?
        </button>
        <button className="quick-btn" onClick={() => handleSend("Como cuidar da manutenção preventiva do carro?")} disabled={isTyping}>
          🚗 Cuidados com Carro
        </button>
        <button className="quick-btn" onClick={() => handleSend("Guia de manutenção preventiva para moto")} disabled={isTyping}>
          🏍️ Cuidados com Moto
        </button>
        <button className="quick-btn" onClick={() => handleSend("Como usar o app e lançar corridas e combustível?")} disabled={isTyping}>
          📱 Suporte & Uso do App
        </button>
        <button className="quick-btn" onClick={() => handleSend("Quanto devo guardar por KM rodado para manutenção?")} disabled={isTyping}>
          💰 Reserva por KM
        </button>
        <button className="quick-btn" onClick={() => handleSend("O que fazer se o motor esquentar ou sair fumaça?")} disabled={isTyping}>
          🚨 Emergência no Motor
        </button>
      </div>

      {/* Janela de Mensagens */}
      <div className="chat-messages glass-panel">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.sender}`}>
            <div className="avatar">
              {msg.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className="message-content">
              <FormattedText content={msg.text} />
              <span className="msg-time">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-bubble ai typing">
            <div className="avatar"><Bot size={18} /></div>
            <div className="message-content typing-content">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input de Mensagem */}
      <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
        <input 
          type="text"
          placeholder="Pergunte sobre manutenção do seu veículo, suporte do app ou lucros..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="chat-input"
          disabled={isTyping}
        />
        <button type="submit" className="btn btn-primary send-btn" disabled={!input.trim() || isTyping}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default AI;
