import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Bot, MessageSquare, Sparkles, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-ai-slack.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/70" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-gradient-primary opacity-5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Status Badge */}
          <Badge variant="outline" className="mb-6 bg-background/50 backdrop-blur-sm border-primary/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Now in Beta
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered
            </span>
            <br />
            Slack Apps
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
            Create intelligent Slack bots that listen, learn, and respond using AI. 
            No coding required - just connect your data and deploy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="gradient" size="lg" className="text-lg px-8 py-6">
              <Bot className="w-5 h-5 mr-2" />
              Start Building
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <MessageSquare className="w-5 h-5 mr-2" />
              View Examples
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Triggers</h3>
              <p className="text-muted-foreground text-sm">
                Listen for specific messages, mentions, or keywords to trigger AI responses automatically.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Context</h3>
              <p className="text-muted-foreground text-sm">
                Upload datasets and connect AI models to provide intelligent, context-aware responses.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Deploy</h3>
              <p className="text-muted-foreground text-sm">
                Deploy your AI apps instantly to Slack with one click. No server setup required.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;