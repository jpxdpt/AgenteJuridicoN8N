import React, { useState, useRef, useEffect } from 'react';
import './App.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! 👋 Sou um assistente jurídico especializado em Direito Português. Como posso ajudar-te?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gera ou recupera sessionId
  useEffect(() => {
    let id = sessionStorage.getItem('chatSessionId');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('chatSessionId', id);
    }
    setSessionId(id);
  }, []);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Adiciona mensagem do utilizador
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Envia para o webhook n8n
      const response = await fetch(
        'https://meu-n8n.loca.lt/webhook/5320a8a6-d091-4e4e-a457-3795c9d0d1f3/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatInput: inputValue,
            sessionId: sessionId,
            metadata: {
              language: 'pt-PT',
              userAgent: navigator.userAgent,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro na comunicação: ${response.status}`);
      }

      const data = await response.json();

      // Adiciona resposta do bot
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        text: data.output || data.response || 'Desculpe, não consegui processar a sua pergunta.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        text: '❌ Erro ao comunicar com o servidor. Por favor, tente novamente.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-app">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <h1>⚖️ Assistente Jurídico</h1>
          <p>Consultas sobre Direito Português</p>
          <span className="session-id">ID: {sessionId.slice(-8)}</span>
        </div>

        {/* Messages */}
        <div className="messages-container">
          {messages.map(message => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="message-bubble">
                  {message.text}
                </div>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('pt-PT', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="message-bubble loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form className="chat-input-form" onSubmit={sendMessage}>
          <div className="input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Escreva a sua pergunta jurídica..."
              disabled={isLoading}
              className="chat-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
          <p className="disclaimer">
            💡 Este assistente fornece informações baseadas em documentação jurídica carregada no sistema. 
            Para consultas complexas, recomenda-se contactar um advogado especializado.
          </p>
        </form>
      </div>
    </div>
  );
};

export default App;
