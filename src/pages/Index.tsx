import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Sparkles, Mic, Send } from "lucide-react";
import { ChatInterface } from "@/components/chat/ChatInterface";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gradient-surface">
        {/* Header */}
        <header className="p-4 border-b border-border">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <h1 className="text-lg font-semibold text-foreground">Mini App Demo</h1>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <div className="w-5 h-5 rounded-full border border-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-md mx-auto p-6 space-y-6">
          <Card className="border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                功能演示
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-muted-foreground leading-relaxed">
                这是一个移动端AI程序作品抽屉UI演示，底部抽屉包含AI智能聊天功能和更多实用功能。
              </CardDescription>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">AI智能助手：</span> 
                    采用前沿的线性图标设计，白色卡片背景，内容居中分布
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">更多功能：</span> 
                    使用圆形图标风格，参考微信小程序设计规范
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Button */}
          <Button
            onClick={() => setIsChatOpen(true)}
            className="w-full h-12 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-chat text-primary-foreground font-medium"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            打开功能面板
          </Button>

          {/* Feature Preview */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-border hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">语音输入</p>
                <p className="text-xs text-muted-foreground mt-1">智能语音识别</p>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">智能回复</p>
                <p className="text-xs text-muted-foreground mt-1">AI 内容生成</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default Index;
