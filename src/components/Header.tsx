import { Button } from "@/components/ui/button";
import { Zap, Bot, MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">SlackAI Builder</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Slack Apps</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#apps" className="text-muted-foreground hover:text-foreground transition-colors">
            My Apps
          </a>
          <a href="#templates" className="text-muted-foreground hover:text-foreground transition-colors">
            Templates
          </a>
          <a href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <MessageSquare className="w-4 h-4" />
            Connect Slack
          </Button>
          <Button variant="gradient" size="sm">
            <Zap className="w-4 h-4" />
            Create App
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;