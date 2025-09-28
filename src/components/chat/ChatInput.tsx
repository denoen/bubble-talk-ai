import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string, type: "text" | "voice") => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);
  const startY = useRef<number>(0);

  const handleSendText = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), "text");
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.start();
      mediaRecorder.current = recorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          // Here you would typically convert audio to text or send to API
          onSendMessage("语音消息已发送", "voice");
        }
      });
    } catch (error) {
      console.error("录音权限被拒绝:", error);
    }
  }, [onSendMessage]);

  const stopRecording = useCallback((send: boolean = true) => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorder.current = null;
    }

    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
    setIsDragging(false);

    if (!send) {
      // Cancelled
      console.log("录音已取消");
    }
  }, [isRecording]);

  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY;
    startRecording();
  };

  const handleMouseUp = () => {
    stopRecording(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isRecording) {
      const deltaY = startY.current - e.clientY;
      if (deltaY > 50) { // 向上拖拽超过50px
        setIsDragging(true);
      } else {
        setIsDragging(false);
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      stopRecording(false); // 取消录音
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* 录音状态提示 */}
      {isRecording && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            {isDragging ? (
              <>
                <X className="w-4 h-4" />
                <span className="text-sm">松开取消</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm">录音中... {formatRecordingTime(recordingTime)}</span>
                <span className="text-xs opacity-70">↑ 向上滑动取消</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2 p-4 bg-chat-input-bg border-t border-border shadow-input">
        <div className="flex-1 relative">
          <Textarea
            placeholder="输入消息..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={disabled || isRecording}
            className={cn(
              "min-h-[44px] max-h-32 resize-none border-border bg-background",
              "focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
              isRecording && "opacity-50"
            )}
            rows={1}
          />
        </div>

        <div className="flex gap-2">
          {/* 语音按钮 */}
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "ghost"}
            className={cn(
              "h-11 w-11 transition-all duration-200",
              isRecording && "animate-pulse-glow",
              isDragging && "bg-destructive/80"
            )}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            disabled={disabled}
          >
            {isRecording ? (
              isDragging ? <X className="h-5 w-5" /> : <Square className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          {/* 发送按钮 */}
          <Button
            size="icon"
            onClick={handleSendText}
            disabled={disabled || !message.trim() || isRecording}
            className={cn(
              "h-11 w-11 bg-gradient-primary hover:opacity-90 transition-all duration-200",
              (!message.trim() || isRecording) && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};