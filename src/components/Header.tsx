import { Button } from "@/components/ui/button";
import { Zap, Circle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Circle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">yarn</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Chat Apps</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/agents" className="text-muted-foreground hover:text-foreground transition-colors">
            My Agents
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/agents">
                <Button variant="gradient" size="sm">
                  <Zap className="w-4 h-4" />
                  Create Agent
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="ghost" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="gradient">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;