import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2, Bot, User, AlertCircle } from "lucide-react";
import type { Automation } from "@/pages/TesteGratis";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  messageType?: "text" | "image" | "buttons";
  buttons?: string[];
  timestamp: Date;
}

interface ChatTestProps {
  automation: Automation;
}

// Generate a unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const ChatTest = ({ automation }: ChatTestProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, [automation]);

  // Add welcome message when automation changes
  useEffect(() => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        type: "bot",
        content: `Olá! Sou o assistente de ${automation.name}. Como posso ajudá-lo hoje?`,
        messageType: "text",
        timestamp: new Date()
      }
    ]);
    setError(null);
  }, [automation]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: "user",
      content: messageText,
      messageType: "text",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(automation.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          automation: automation.id,
          message: messageText,
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the response format from n8n
      const botMessage: Message = {
        id: `bot_${Date.now()}`,
        type: "bot",
        content: data.content || data.message || data.text || "Resposta recebida",
        messageType: data.type || "text",
        buttons: data.buttons,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Não foi possível conectar com o servidor. Tente novamente.");
      
      // Add error message to chat
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: "bot",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        messageType: "text",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleButtonClick = (buttonText: string) => {
    sendMessage(buttonText);
  };

  const renderMessageContent = (message: Message) => {
    switch (message.messageType) {
      case "image":
        return (
          <div>
            <img 
              src={message.content} 
              alt="Imagem da resposta"
              className="rounded-lg max-w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        );
      
      case "buttons":
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {message.buttons?.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleButtonClick(button)}
                  className="text-xs"
                >
                  {button}
                </Button>
              ))}
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary/10 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{automation.icon}</div>
          <div>
            <h3 className="font-semibold text-foreground">{automation.name}</h3>
            <p className="text-xs text-muted-foreground">Online • Responde instantaneamente</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto p-4 bg-muted/30">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 mb-4 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                }`}
              >
                {renderMessageContent(message)}
                <span className="text-[10px] opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2 mb-4"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Digitando...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-destructive/10 border-t border-destructive/20 px-4 py-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <span className="text-sm text-destructive">{error}</span>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-border p-4 bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="px-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Sessão: {sessionId.substring(0, 20)}...
        </p>
      </form>
    </Card>
  );
};
