import { cn } from "@/lib/utils";

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
        "flex animate-fade-in mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[75%] px-4 py-2 rounded-2xl",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
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