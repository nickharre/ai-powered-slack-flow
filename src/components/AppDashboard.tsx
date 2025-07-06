import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Plus, 
  Settings, 
  Activity, 
  Users, 
  MessageSquare,
  Zap,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2
} from "lucide-react";

const mockApps = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Automatically responds to customer queries with AI-powered answers",
    status: "active",
    triggers: 24,
    responses: 156,
    accuracy: 94,
    model: "GPT-4",
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Code Review Assistant",
    description: "Reviews pull requests and provides coding suggestions",
    status: "paused",
    triggers: 8,
    responses: 43,
    accuracy: 87,
    model: "Claude-3",
    lastActive: "1 day ago"
  },
  {
    id: 3,
    name: "Meeting Summarizer",
    description: "Summarizes meeting transcripts and action items",
    status: "active",
    triggers: 12,
    responses: 78,
    accuracy: 92,
    model: "GPT-4",
    lastActive: "30 minutes ago"
  }
];

const AppDashboard = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/80" id="apps">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">My AI Apps</h2>
            <p className="text-muted-foreground">Manage and monitor your Slack AI applications</p>
          </div>
          <Button variant="gradient" size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New App
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +12%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">3</h3>
            <p className="text-muted-foreground text-sm">Active Apps</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +34%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">277</h3>
            <p className="text-muted-foreground text-sm">Total Responses</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +8%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">91%</h3>
            <p className="text-muted-foreground text-sm">Avg Accuracy</p>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                +23%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">44</h3>
            <p className="text-muted-foreground text-sm">Total Triggers</p>
          </Card>
        </div>

        {/* Apps List */}
        <div className="space-y-6">
          {mockApps.map((app) => (
            <Card key={app.id} className="p-6 bg-gradient-card border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{app.name}</h3>
                      <Badge 
                        variant={app.status === 'active' ? 'default' : 'secondary'}
                        className={app.status === 'active' ? 'bg-success/10 text-success border-success/20' : ''}
                      >
                        {app.status === 'active' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                        {app.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{app.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Triggers:</span>
                        <span className="ml-2 font-medium">{app.triggers}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Responses:</span>
                        <span className="ml-2 font-medium">{app.responses}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="ml-2 font-medium text-success">{app.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Model:</span>
                        <span className="ml-2 font-medium">{app.model}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  Last active: {app.lastActive}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Activity className="w-4 h-4 mr-1" />
                    View Analytics
                  </Button>
                  <Button variant="default" size="sm">
                    <Zap className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppDashboard;