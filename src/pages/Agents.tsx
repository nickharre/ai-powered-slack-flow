import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bot, Edit, Trash2, Power, PowerOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AgentForm } from "@/components/AgentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Agent {
  id: string;
  name: string;
  description: string;
  slack_channel: string;
  slack_workspace: string;
  ai_model: string;
  system_prompt: string;
  trigger_keywords: string[];
  trigger_mentions: boolean;
  trigger_all_messages: boolean;
  response_template: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to load agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({ is_active: !currentStatus })
        .eq('id', agentId);

      if (error) throw error;

      setAgents(agents.map(agent => 
        agent.id === agentId 
          ? { ...agent, is_active: !currentStatus }
          : agent
      ));

      toast({
        title: "Success",
        description: `Agent ${!currentStatus ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      });
    }
  };

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const { error } = await supabase
        .from('agents')
        .delete()
        .eq('id', agentId);

      if (error) throw error;

      setAgents(agents.filter(agent => agent.id !== agentId));
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    }
  };

  const handleAgentCreated = () => {
    setShowCreateForm(false);
    fetchAgents();
  };

  const handleAgentUpdated = () => {
    setEditingAgent(null);
    fetchAgents();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Agents
              </h1>
              <p className="text-muted-foreground mt-2">
                Create and manage your intelligent Slack bots
              </p>
            </div>
            
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Agent
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New AI Agent</DialogTitle>
                </DialogHeader>
                <AgentForm onSuccess={handleAgentCreated} />
              </DialogContent>
            </Dialog>
          </div>

          {agents.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No agents yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first AI agent to get started with intelligent Slack automation
              </p>
              <Button variant="gradient" onClick={() => setShowCreateForm(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Agent
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <Bot className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {agent.description || 'No description'}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={agent.is_active ? "default" : "secondary"}>
                        {agent.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
                        <p className="text-sm">{agent.slack_workspace || 'Not configured'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Channel</p>
                        <p className="text-sm">{agent.slack_channel || 'Not configured'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">AI Model</p>
                        <p className="text-sm">{agent.ai_model}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Triggers</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {agent.trigger_mentions && (
                            <Badge variant="outline" className="text-xs">@mentions</Badge>
                          )}
                          {agent.trigger_all_messages && (
                            <Badge variant="outline" className="text-xs">All messages</Badge>
                          )}
                          {agent.trigger_keywords?.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                      >
                        {agent.is_active ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAgent(agent)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAgent(agent.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Edit Agent Dialog */}
          <Dialog open={!!editingAgent} onOpenChange={() => setEditingAgent(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Agent</DialogTitle>
              </DialogHeader>
              {editingAgent && (
                <AgentForm 
                  agent={editingAgent} 
                  onSuccess={handleAgentUpdated} 
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Agents;