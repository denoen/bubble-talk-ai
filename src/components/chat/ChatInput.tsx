import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (content: string, type: "text" | "voice") => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleSendText = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), "text");
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendText();
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    setMessage("");
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
          onSendMessage("语音消息已发送", "voice");
        }
      });
    } catch (error) {
      console.error("录音权限被拒绝:", error);
    }
  }, [onSendMessage]);

  const stopRecording = useCallback(() => {
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
  }, [isRecording]);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* 录音状态提示 */}
      {isRecording && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-muted px-3 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-foreground">录音中... {formatRecordingTime(recordingTime)}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-3 bg-background border-t border-border">
        {isVoiceMode ? (
          // 语音模式
          <div className="flex-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoiceMode}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 flex items-center justify-center">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "secondary"}
                className={cn(
                  "w-full h-10 transition-all duration-200",
                  isRecording && "animate-pulse"
                )}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={disabled}
              >
                <Mic className="h-5 w-5 mr-2" />
                {isRecording ? `录音中 ${formatRecordingTime(recordingTime)}` : "按住说话"}
              </Button>
            </div>
          </div>
        ) : (
          // 文字模式
          <>
            <div className="flex-1">
              <Input
                placeholder="输入消息..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={disabled}
                className="border-border bg-background focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoiceMode}
              className="text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={handleSendText}
              disabled={disabled || !message.trim()}
              className={cn(
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                !message.trim() && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};