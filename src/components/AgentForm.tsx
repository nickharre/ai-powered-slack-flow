import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
}

interface AgentFormProps {
  agent?: Agent;
  onSuccess: () => void;
}

export const AgentForm = ({ agent, onSuccess }: AgentFormProps) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    description: agent?.description || '',
    slack_channel: agent?.slack_channel || '',
    slack_workspace: agent?.slack_workspace || '',
    ai_model: agent?.ai_model || 'gpt-4o-mini',
    system_prompt: agent?.system_prompt || '',
    trigger_keywords: agent?.trigger_keywords || [],
    trigger_mentions: agent?.trigger_mentions || false,
    trigger_all_messages: agent?.trigger_all_messages || false,
    response_template: agent?.response_template || '',
    is_active: agent?.is_active !== undefined ? agent.is_active : true,
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !formData.trigger_keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        trigger_keywords: [...prev.trigger_keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      trigger_keywords: prev.trigger_keywords.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const agentData = {
        ...formData,
        user_id: user.id,
      };

      if (agent) {
        // Update existing agent
        const { error } = await supabase
          .from('agents')
          .update(agentData)
          .eq('id', agent.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Agent updated successfully",
        });
      } else {
        // Create new agent
        const { error } = await supabase
          .from('agents')
          .insert([agentData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Agent created successfully",
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: "Error",
        description: `Failed to ${agent ? 'update' : 'create'} agent`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Agent Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Customer Support Bot"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai_model">AI Model</Label>
          <Select
            value={formData.ai_model}
            onValueChange={(value) => handleInputChange('ai_model', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast & Affordable)</SelectItem>
              <SelectItem value="gpt-4o">GPT-4o (Advanced)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description of what this agent does"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slack_workspace">Slack Workspace</Label>
          <Input
            id="slack_workspace"
            value={formData.slack_workspace}
            onChange={(e) => handleInputChange('slack_workspace', e.target.value)}
            placeholder="e.g., mycompany.slack.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slack_channel">Slack Channel</Label>
          <Input
            id="slack_channel"
            value={formData.slack_channel}
            onChange={(e) => handleInputChange('slack_channel', e.target.value)}
            placeholder="e.g., #general or @username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt</Label>
        <Textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => handleInputChange('system_prompt', e.target.value)}
          placeholder="Define the agent's personality and behavior..."
          rows={4}
        />
      </div>

      <div className="space-y-4">
        <Label>Trigger Conditions</Label>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="trigger_mentions"
            checked={formData.trigger_mentions}
            onCheckedChange={(checked) => handleInputChange('trigger_mentions', checked)}
          />
          <Label htmlFor="trigger_mentions">Respond to @mentions</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="trigger_all_messages"
            checked={formData.trigger_all_messages}
            onCheckedChange={(checked) => handleInputChange('trigger_all_messages', checked)}
          />
          <Label htmlFor="trigger_all_messages">Respond to all messages</Label>
        </div>

        <div className="space-y-3">
          <Label>Trigger Keywords</Label>
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" onClick={addKeyword} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.trigger_keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {keyword}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeKeyword(keyword)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="response_template">Response Template (Optional)</Label>
        <Textarea
          id="response_template"
          value={formData.response_template}
          onChange={(e) => handleInputChange('response_template', e.target.value)}
          placeholder="Template for responses (use {message} for user input)..."
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleInputChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Activate agent</Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} variant="gradient" className="flex-1">
          {loading ? 'Saving...' : (agent ? 'Update Agent' : 'Create Agent')}
        </Button>
      </div>
    </form>
  );
};