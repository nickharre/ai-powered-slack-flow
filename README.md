# yarn - AI-Powered Chat Apps Made Easy

![yarn Logo](src/assets/yarn-icon.svg)

yarn is a platform that makes it incredibly easy to create and deploy AI-powered chat applications across multiple platforms like Slack and Microsoft Teams. No complex setup, no server management - just simple configuration and your AI agents are ready to go.

## 🚀 Features

- **Multi-Platform Support**: Deploy to Slack and Microsoft Teams with the same agent
- **Easy Setup**: Step-by-step guides for platform integration
- **Flexible Triggers**: Configure when your agents respond (mentions, keywords, all messages)
- **Custom AI Models**: Support for various OpenAI models including GPT-4
- **Context-Aware**: Upload context files to make your agents domain-specific
- **Real-time Management**: Create, edit, and manage agents through a beautiful web interface
- **Secure**: Built-in authentication and secure credential storage

## 🎯 Use Cases

- **Customer Support**: Automated first-line support in Slack channels
- **Team Assistance**: AI assistants for internal team workflows
- **Knowledge Base**: Context-aware bots that answer questions about your products/services
- **Meeting Coordination**: Bots that help schedule and manage team activities
- **Code Review**: AI assistants that help with development workflows

## 🏃‍♂️ Quick Start

### 1. Sign Up & Login
Visit the yarn platform and create your account using email/password authentication.

### 2. Create Your First Agent
1. Click "Create Agent" on your dashboard
2. Give your agent a name and description
3. Choose which platforms to deploy to (Slack, Teams, or both)
4. Configure your AI model and system prompt
5. Set up trigger conditions (mentions, keywords, etc.)

### 3. Platform Integration
Follow our step-by-step setup guides:
- **Slack**: Complete OAuth setup and event subscriptions
- **Microsoft Teams**: Configure Azure Bot Service and Teams app manifest

### 4. Deploy & Test
Once configured, your agent will automatically respond to messages based on your trigger settings.

## 📋 Platform Setup Guides

### Slack Integration

#### Prerequisites
- Slack workspace admin access
- yarn account with agent created

#### Setup Steps
1. **Create Slack App**
   - Go to [Slack API Dashboard](https://api.slack.com/apps)
   - Create new app "From scratch"
   - Name your app and select workspace

2. **Configure Event Subscriptions**
   - Enable Event Subscriptions in your Slack app
   - Set Request URL to: `https://ayiluypvbpxhbuwthokx.supabase.co/functions/v1/unified-webhook`
   - Subscribe to `message.channels` bot event

3. **Set OAuth Permissions**
   - Add bot token scopes: `channels:read`, `chat:write`, `users:read`
   - Install app to workspace
   - Copy Bot User OAuth Token (starts with `xoxb-`)

4. **Get Credentials**
   - Bot Token: Found in OAuth & Permissions
   - Signing Secret: Found in Basic Information

5. **Configure Agent**
   - Enter credentials in your yarn agent settings
   - Activate your agent

### Microsoft Teams Integration

#### Prerequisites
- Azure subscription
- Microsoft Teams admin access
- yarn account with agent created

#### Setup Steps
1. **Create Azure Bot Service**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new Bot Service resource
   - Set messaging endpoint to: `https://ayiluypvbpxhbuwthokx.supabase.co/functions/v1/unified-webhook`

2. **Get Bot Credentials**
   - Copy App ID (Client ID) from Configuration page
   - Create App Secret in "Certificates & secrets"
   - Optional: Copy Tenant ID from Azure AD properties

3. **Enable Teams Channel**
   - In bot settings, go to "Channels"
   - Enable "Microsoft Teams" channel
   - Configure Teams-specific settings

4. **Create Teams App**
   - Use [Teams App Studio](https://dev.teams.microsoft.com/home) or create manifest manually
   - Include Bot ID in manifest
   - Package and upload to Teams Admin Center

5. **Configure Agent**
   - Enter credentials in your yarn agent settings
   - Activate your agent

## ⚙️ Agent Configuration

### Trigger Settings
- **Mentions**: Respond only when @mentioned
- **Keywords**: Respond to messages containing specific words/phrases
- **All Messages**: Respond to every message in the channel
- **Channel Specific**: Limit responses to specific channels

### AI Configuration
- **Model Selection**: Choose from available OpenAI models
- **System Prompt**: Define your agent's personality and behavior
- **Response Template**: Structure how responses are formatted
- **Context Data**: Upload files or add text to give your agent domain knowledge

### Platform Settings
- **Slack**: Bot token, signing secret, workspace, channel restrictions
- **Teams**: App ID, password, tenant ID, service URL

## 🔒 Security & Privacy

- All credentials are encrypted and stored securely
- Webhook endpoints use HTTPS with signature verification
- Row-level security ensures users only access their own agents
- No message content is stored permanently
- API keys are managed through secure environment variables

## 🛠️ Development

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Deployment**: Vite build system
- **AI Integration**: OpenAI API

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Configure Supabase connection in environment

### API Integration
The platform uses Supabase Edge Functions for webhook handling and AI processing. All platform integrations route through the unified webhook endpoint.

## 📞 Support

- **Documentation**: Check our in-app setup guides
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord community
- **Email**: Contact support team

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please see our Contributing Guide for details on how to get started.

---

**Made with ❤️ by the yarn team**

*Making AI-powered chat applications accessible to everyone*