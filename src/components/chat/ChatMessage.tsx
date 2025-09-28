import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  type?: "text" | "card";
  cardData?: any;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className={cn("w-8 h-8 border-2", isUser ? "border-primary/20" : "border-muted")}>
        <AvatarFallback className={cn(isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div
        className={cn(
          "flex flex-col max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-card transition-all duration-200 hover:shadow-lg",
            isUser
              ? "bg-chat-user-bg text-chat-user-fg rounded-br-md"
              : "bg-chat-system-bg text-chat-system-fg rounded-bl-md"
          )}
        >
          {message.type === "card" ? (
            <CustomCard data={message.cardData} />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}
        </div>
        
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
};

const CustomCard = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <div className="bg-gradient-surface border border-border rounded-lg p-4 min-w-[200px]">
      {data.title && (
        <h3 className="font-semibold text-sm mb-2 text-foreground">{data.title}</h3>
      )}
      {data.description && (
        <p className="text-xs text-muted-foreground mb-3">{data.description}</p>
      )}
      {data.actions && (
        <div className="flex gap-2">
          {data.actions.map((action: any, index: number) => (
            <button
              key={index}
              className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => action.onClick?.()}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};