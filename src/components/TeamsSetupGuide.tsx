import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle } from "lucide-react";

export const TeamsSetupGuide = () => {
  const webhookUrl = `https://ayiluypvbpxhbuwthokx.supabase.co/functions/v1/unified-webhook`;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Microsoft Teams Integration Setup
        </h2>
        <p className="text-muted-foreground">
          Follow these steps to create and configure your Teams bot
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <CardTitle className="text-lg">Create Azure Bot Service</CardTitle>
                <CardDescription>Register your bot in Azure</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                1. Go to the <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  Azure Portal <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <p className="text-sm">2. Create a new "Bot Service" resource</p>
              <p className="text-sm">3. Choose "Multi-tenant" for the bot type</p>
              <p className="text-sm">4. Set the messaging endpoint to:</p>
              <div className="bg-muted p-2 rounded-md font-mono text-xs break-all">
                {webhookUrl}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <CardTitle className="text-lg">Get Bot Credentials</CardTitle>
                <CardDescription>Copy the App ID and create a secret</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">App ID (Client ID)</p>
                  <p className="text-xs text-muted-foreground">Found in the bot's Configuration page</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">App Secret (Client Secret)</p>
                  <p className="text-xs text-muted-foreground">Create in "Certificates & secrets" section</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Tenant ID (Optional)</p>
                  <p className="text-xs text-muted-foreground">Found in Azure Active Directory properties</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <CardTitle className="text-lg">Configure Teams Channel</CardTitle>
                <CardDescription>Enable Teams integration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">1. In your bot's settings, go to "Channels"</p>
              <p className="text-sm">2. Click on "Microsoft Teams" to enable it</p>
              <p className="text-sm">3. Configure any additional Teams-specific settings</p>
              <p className="text-sm">4. Save the configuration</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">4</span>
              </div>
              <div>
                <CardTitle className="text-lg">Create Teams App Manifest</CardTitle>
                <CardDescription>Package your bot for Teams</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                1. Use <a href="https://dev.teams.microsoft.com/home" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                  Teams App Studio <ExternalLink className="w-3 h-3" />
                </a> or create manifest manually
              </p>
              <p className="text-sm">2. Include your Bot ID in the manifest</p>
              <p className="text-sm">3. Set up required permissions and scopes</p>
              <p className="text-sm">4. Package and upload to Teams Admin Center</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <CardTitle className="text-lg">Test Your Bot</CardTitle>
                <CardDescription>Verify the integration works</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">1. Install your bot in a Teams channel or chat</p>
              <p className="text-sm">2. Send a test message that matches your trigger conditions</p>
              <p className="text-sm">3. Verify your agent responds correctly</p>
              <p className="text-sm">4. Check the agent logs for any errors</p>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0 mt-0.5"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notes
                  </p>
                  <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                    <li>• Teams bots require Azure subscription</li>
                    <li>• The webhook URL must be HTTPS</li>
                    <li>• Bot responses are subject to Teams rate limits</li>
                    <li>• Test in a non-production environment first</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Webhook URL for Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Use this URL as your bot's messaging endpoint in Azure Bot Service:
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-sm font-mono break-all text-green-800 dark:text-green-200">
                    {webhookUrl}
                  </code>
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    Production Ready
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};