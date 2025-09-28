import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "你好！我是AI助手，有什么可以帮助你的吗？",
      role: "assistant",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, type: "text" | "voice") => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: mockAIResponse(content),
        role: "assistant",
        timestamp: new Date(),
        type: Math.random() > 0.7 ? "card" : "text",
        cardData: Math.random() > 0.7 ? {
          title: "推荐内容",
          description: "基于你的兴趣，为你推荐以下内容",
          actions: [
            { label: "查看详情", onClick: () => console.log("查看详情") },
            { label: "收藏", onClick: () => console.log("收藏") }
          ]
        } : undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const mockAIResponse = (userMessage: string): string => {
    const responses = [
      "我理解你的需求，让我为你提供一些建议。",
      "这是一个很好的问题！让我来帮你分析一下。",
      "根据你提到的信息，我建议你可以考虑以下几个方面...",
      "我已经为你整理了相关信息，希望对你有帮助。",
      "感谢你的提问，我会尽力为你提供准确的答案。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleGetRecommendations = () => {
    const recommendationMessage: Message = {
      id: Date.now().toString(),
      content: "",
      role: "assistant", 
      timestamp: new Date(),
      type: "card",
      cardData: {
        title: "内容推荐",
        description: "根据你的兴趣爱好，为你推荐以下精选内容",
        actions: [
          { label: "电影", onClick: () => console.log("电影推荐") },
          { label: "图书", onClick: () => console.log("图书推荐") },
          { label: "AI工具", onClick: () => console.log("AI工具推荐") }
        ]
      }
    };

    setMessages(prev => [...prev, recommendationMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 背景蒙层 */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* 浮层内容 */}
      <div className="absolute bottom-0 left-0 right-0 h-[70vh] max-w-md mx-auto bg-background rounded-t-2xl shadow-chat animate-slide-up">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {/* 顶部拖拽条 */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-muted-foreground/30 rounded-full" />
            
            <div className="flex items-center gap-3 mt-2">
              <div>
                <h2 className="font-semibold text-foreground">AI 助手</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGetRecommendations}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                推荐
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-muted"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </ScrollArea>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  );
};