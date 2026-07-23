import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { processQuery } from '../../ai/assistant';
import './AI.css';

const QUICK_QUESTIONS = [
  "Quanto ganhei hoje e qual meu lucro?",
  "Como está o status da minha Garagem?",
  "Vale a pena continuar rodando agora?",
  "Quanto preciso guardar por KM para peças?",
  "Com o que mais gastei dinheiro?",
  "Qual meu acumulado no mês?"
];

const INITIAL_MESSAGE = {
  id: 'init-1',
  sender: 'ai',
  text: 'Olá! Sou a Motor IA, sua consultora pessoal de faturamento e mecânica.\n\nEstou conectada ao seu financeiro e à sua garagem em tempo real. Como posso te ajudar hoje?',
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

  // Carrega histórico de mensagens do localStorage ou inicia com mensagem padrão
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('motorIA_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Erro ao ler historico do chat:', e);
      }
    }
    return [INITIAL_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Dados da Garagem carregados do localStorage
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

  // Salvar historico no localStorage
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
      // Processa a consulta
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

  return (
    <div className="ai-container">
      {/* Header Limpo e Profissional */}
      <div className="page-header header-ai-flex">
        <div>
          <div className="header-title-ai">
            <Sparkles className="icon-sparkle" size={22} />
            <h2>Motor IA</h2>
          </div>
          <p>Consultoria financeira e mecânica em tempo real</p>
        </div>

        <div className="ai-header-actions">
          <button 
            className="btn-icon-ai danger" 
            title="Limpar Conversa"
            onClick={handleClearHistory}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Sugestões Rápidas */}
      <div className="quick-questions">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button key={idx} className="quick-btn" onClick={() => handleSend(q)} disabled={isTyping}>
            {q}
          </button>
        ))}
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
          placeholder="Pergunte sobre seu lucro, despesas ou revisão do carro..." 
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
