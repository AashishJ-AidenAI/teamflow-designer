
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

interface ChatAgentProps {
  agentName: string;
  agentType: string;
}

const ChatAgent: React.FC<ChatAgentProps> = ({ agentName, agentType }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsThinking(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        role: "bot",
        content: `This is a simulated response from the ${agentName} agent. In a real implementation, this would be the actual AI response based on your input.`,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsThinking(false);
    }, 1500);
  };
  
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const clearChat = () => {
    setMessages([]);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  
  return (
    <div className="flex flex-col h-full rounded-lg border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">{agentName}</h3>
            <p className="text-xs text-muted-foreground">{agentType}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={clearChat}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Chat
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.role === "user" ? "ml-auto" : ""
              )}
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground order-2" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              
              <div 
                className={cn(
                  "rounded-lg p-3",
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                <div className="mb-1 text-xs opacity-70">
                  {message.role === "user" ? "You" : agentName} • {formatTime(message.timestamp)}
                </div>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-lg p-3 bg-secondary text-secondary-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-current animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-3 flex gap-2">
        <Input 
          placeholder="Type your message..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={isThinking}
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!input.trim() || isThinking}
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatAgent;
