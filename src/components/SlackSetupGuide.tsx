import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const SlackSetupGuide = () => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  const { toast } = useToast();
  
  const webhookUrl = `https://ayiluypvbpxhbuwthokx.supabase.co/functions/v1/unified-webhook`;

  const copyToClipboard = (text: string, step: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  const steps = [
    {
      id: "create-app",
      title: "Create a Slack App",
      completed: false,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Go to the Slack API dashboard and create a new app
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://api.slack.com/apps" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Slack Apps
              </a>
            </Button>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Click "Create New App" → "From scratch"</li>
            <li>• Name your app (e.g., "AI Assistant")</li>
            <li>• Select your workspace</li>
          </ul>
        </div>
      )
    },
    {
      id: "event-subscriptions",
      title: "Configure Event Subscriptions",
      completed: false,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Set up your app to receive message events
          </p>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Request URL:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background p-2 rounded border">
                {webhookUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              >
                {copiedStep === 'webhook' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Go to "Event Subscriptions" in your Slack app</li>
            <li>• Toggle "Enable Events" to ON</li>
            <li>• Paste the Request URL above</li>
            <li>• Subscribe to <code className="bg-muted px-1 rounded">message.channels</code> bot event</li>
            <li>• Save changes</li>
          </ul>
        </div>
      )
    },
    {
      id: "oauth-permissions",
      title: "Set OAuth Permissions",
      completed: false,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Add required permissions for your bot
          </p>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Required Bot Token Scopes:</p>
            <div className="flex flex-wrap gap-2">
              {['channels:read', 'chat:write', 'users:read'].map((scope) => (
                <Badge key={scope} variant="secondary" className="text-xs">
                  {scope}
                </Badge>
              ))}
            </div>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Go to "OAuth & Permissions"</li>
            <li>• Add the scopes listed above under "Bot Token Scopes"</li>
            <li>• Install/Reinstall the app to your workspace</li>
            <li>• Copy the "Bot User OAuth Token" (starts with xoxb-)</li>
          </ul>
        </div>
      )
    },
    {
      id: "get-credentials",
      title: "Get Your Credentials",
      completed: false,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Collect the credentials needed for your agents
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Bot Token</p>
              <p className="text-xs text-muted-foreground">OAuth & Permissions → Bot User OAuth Token</p>
              <code className="text-xs">xoxb-...</code>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Signing Secret</p>
              <p className="text-xs text-muted-foreground">Basic Information → Signing Secret</p>
              <code className="text-xs">abc123...</code>
            </div>
          </div>
          <Alert>
            <AlertDescription className="text-sm">
              You'll enter these credentials when creating or editing your AI agents. 
              Each agent can have its own Slack workspace connection.
            </AlertDescription>
          </Alert>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Slack Integration Setup</h2>
        <p className="text-muted-foreground">
          Follow these steps to connect your AI agents to Slack workspaces
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  {step.completed && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {step.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertDescription>
          <strong>Need help?</strong> Check out the{' '}
          <a 
            href="https://api.slack.com/start/building/bolt-js" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            official Slack API documentation
          </a>{' '}
          for more detailed instructions.
        </AlertDescription>
      </Alert>
    </div>
  );
};