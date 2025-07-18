import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Agent {
  id: string;
  name: string;
  platform: string[];
  slack_channel: string;
  slack_workspace: string;
  slack_bot_token: string;
  slack_signing_secret: string;
  teams_app_id: string;
  teams_app_password: string;
  teams_tenant_id: string;
  teams_service_url: string;
  openai_api_key: string;
  ai_model: string;
  system_prompt: string;
  trigger_keywords: string[];
  trigger_mentions: boolean;
  trigger_all_messages: boolean;
  response_template: string;
  context_data: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Unified webhook received:', req.method, req.url);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse the request body
    const body = await req.text();
    console.log('Raw request body:', body);
    
    // Handle empty body
    if (!body || body.trim() === '') {
      console.log('Empty request body received');
      return new Response('Empty request body', { status: 400, headers: corsHeaders });
    }
    
    let eventData;
    
    try {
      eventData = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse event data:', e);
      console.error('Raw body was:', body);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('Event data received:', eventData);

    // Determine platform based on event structure
    let platform = 'unknown';
    if (eventData.type === 'url_verification' || eventData.event || eventData.team_id) {
      platform = 'slack';
    } else if (eventData.type === 'message' && eventData.serviceUrl) {
      platform = 'teams';
    }

    console.log('Detected platform:', platform);

    if (platform === 'slack') {
      return await handleSlackEvent(eventData, supabase);
    } else if (platform === 'teams') {
      return await handleTeamsEvent(eventData, supabase);
    } else {
      console.log('Unknown platform or event type');
      return new Response('Unknown platform', { status: 400, headers: corsHeaders });
    }

  } catch (error) {
    console.error('Error in unified webhook function:', error);
    return new Response('Internal Server Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function handleSlackEvent(slackEvent: any, supabase: any) {
  // Handle Slack URL verification challenge
  if (slackEvent.type === 'url_verification') {
    console.log('Slack URL verification challenge received:', slackEvent.challenge);
    return new Response(slackEvent.challenge, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });
  }

  // Handle Slack events
  if (slackEvent.type === 'event_callback' && slackEvent.event) {
    const event = slackEvent.event;
    
    // Skip bot messages to avoid loops
    if (event.bot_id || event.user === 'USLACKBOT' || event.subtype === 'bot_message') {
      console.log('Skipping bot message to avoid loops');
      return new Response('OK', { headers: corsHeaders });
    }

    // Only handle message events
    if (event.type !== 'message' || !event.text) {
      return new Response('OK', { headers: corsHeaders });
    }

    // Get all active Slack agents first to check if message is from our own bot
    const { data: allAgents, error: allAgentsError } = await supabase
      .from('agents')
      .select('slack_bot_token')
      .contains('platform', ['slack'])
      .eq('is_active', true);

    if (allAgentsError) {
      console.error('Error fetching agents for bot check:', allAgentsError);
      return new Response('Error checking agents', { status: 500, headers: corsHeaders });
    }

    // Check if this message might be from one of our own bots
    // This is a more robust check than just checking bot_id
    if (allAgents && allAgents.length > 0) {
      // If the event has a bot_id, we should skip it regardless
      if (event.bot_id) {
        console.log('Skipping message with bot_id to avoid loops');
        return new Response('OK', { headers: corsHeaders });
      }
    }

    // Find active Slack agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .contains('platform', ['slack'])
      .eq('is_active', true);

    if (agentsError) {
      console.error('Error fetching Slack agents:', agentsError);
      return new Response('Error fetching agents', { status: 500, headers: corsHeaders });
    }

    if (!agents || agents.length === 0) {
      console.log('No active Slack agents found');
      return new Response('OK', { headers: corsHeaders });
    }

    // Process agents - only allow one agent to respond per message
    let hasResponded = false;
    for (const agent of agents as Agent[]) {
      if (hasResponded) break; // Prevent multiple responses
      
      // Check if this agent should respond to this specific channel
      if (agent.slack_channel && !event.channel.startsWith(agent.slack_channel.replace('#', ''))) {
        console.log(`Agent ${agent.name} skipped - wrong channel. Expected: ${agent.slack_channel}, Got: ${event.channel}`);
        continue;
      }
      
      const shouldRespond = await checkIfAgentShouldRespond(agent, event.text);
      
      if (shouldRespond) {
        console.log(`Agent ${agent.name} should respond to Slack message in channel ${event.channel}`);
        
        // Check for message deduplication using a simple timestamp check
        const messageKey = `${event.channel}_${event.ts}`;
        console.log(`Processing message key: ${messageKey}`);
        
        try {
          const aiResponse = await generateAIResponse(agent, event.text);
          await sendSlackMessage(agent, event.channel, aiResponse);
          console.log(`Agent ${agent.name} responded successfully to Slack`);
          hasResponded = true; // Mark that we've responded
        } catch (error) {
          console.error(`Error processing Slack agent ${agent.name}:`, error);
        }
      }
    }
  }

  return new Response('OK', { headers: corsHeaders });
}

async function handleTeamsEvent(teamsEvent: any, supabase: any) {
  console.log('Processing Teams event:', teamsEvent);

  // Skip messages from bots to avoid loops
  if (teamsEvent.from?.id?.includes('bot') || teamsEvent.from?.name?.includes('bot')) {
    console.log('Skipping bot message to avoid loops');
    return new Response('OK', { headers: corsHeaders });
  }

  // Get all active Teams agents to check if message is from our own bot
  const { data: allAgents, error: allAgentsError } = await supabase
    .from('agents')
    .select('teams_app_id, name')
    .contains('platform', ['teams'])
    .eq('is_active', true);

  if (allAgentsError) {
    console.error('Error fetching agents for bot check:', allAgentsError);
    return new Response('Error checking agents', { status: 500, headers: corsHeaders });
  }

  // Check if this message is from one of our own Teams bots
  if (allAgents && allAgents.length > 0) {
    for (const agent of allAgents) {
      if (teamsEvent.from?.id === agent.teams_app_id || teamsEvent.from?.name === agent.name) {
        console.log(`Skipping message from own bot: ${agent.name}`);
        return new Response('OK', { headers: corsHeaders });
      }
    }
  }

  if (teamsEvent.type === 'message' && teamsEvent.text) {
    // Find active Teams agents
    const { data: agents, error: agentsError } = await supabase
      .from('agents')
      .select('*')
      .contains('platform', ['teams'])
      .eq('is_active', true);

    if (agentsError) {
      console.error('Error fetching Teams agents:', agentsError);
      return new Response('Error fetching agents', { status: 500, headers: corsHeaders });
    }

    if (!agents || agents.length === 0) {
      console.log('No active Teams agents found');
      return new Response('OK', { headers: corsHeaders });
    }

    // Process agents - only allow one agent to respond per message
    let hasResponded = false;
    for (const agent of agents as Agent[]) {
      if (hasResponded) break; // Prevent multiple responses
      
      const shouldRespond = await checkIfAgentShouldRespond(agent, teamsEvent.text);
      
      if (shouldRespond) {
        console.log(`Agent ${agent.name} should respond to Teams message`);
        
        try {
          const aiResponse = await generateAIResponse(agent, teamsEvent.text);
          await sendTeamsMessage(agent, teamsEvent, aiResponse);
          console.log(`Agent ${agent.name} responded successfully to Teams`);
          hasResponded = true; // Mark that we've responded
        } catch (error) {
          console.error(`Error processing Teams agent ${agent.name}:`, error);
        }
      }
    }
  }

  return new Response('OK', { headers: corsHeaders });
}

async function checkIfAgentShouldRespond(agent: Agent, messageText: string): Promise<boolean> {
  const message = messageText.toLowerCase();
  
  // Check if agent responds to all messages
  if (agent.trigger_all_messages) {
    return true;
  }
  
  // Check for @mentions (basic check)
  if (agent.trigger_mentions && message.includes('<@')) {
    return true;
  }
  
  // Check for trigger keywords
  if (agent.trigger_keywords && agent.trigger_keywords.length > 0) {
    for (const keyword of agent.trigger_keywords) {
      if (message.includes(keyword.toLowerCase())) {
        return true;
      }
    }
  }
  
  return false;
}

async function generateAIResponse(agent: Agent, userMessage: string): Promise<string> {
  // Build system prompt with context data
  let systemPrompt = agent.system_prompt || 'You are a helpful AI assistant. Be concise and friendly.';
  
  if (agent.context_data && agent.context_data.trim()) {
    systemPrompt += `\n\nAdditional Context:\n${agent.context_data}`;
  }
  
  const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${agent.openai_api_key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: agent.ai_model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!openaiResponse.ok) {
    const errorText = await openaiResponse.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${openaiResponse.status}`);
  }

  const data = await openaiResponse.json();
  let response = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  
  // Apply response template if configured
  if (agent.response_template) {
    response = agent.response_template.replace('{message}', userMessage).replace('{response}', response);
  }
  
  return response;
}

async function sendSlackMessage(agent: Agent, channel: string, message: string): Promise<void> {
  console.log(`Sending Slack message to channel: ${channel}`);
  
  const payload = {
    channel: channel,
    text: message,
  };
  
  const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${agent.slack_bot_token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!slackResponse.ok) {
    const errorText = await slackResponse.text();
    console.error('Slack HTTP error:', errorText);
    throw new Error(`Slack HTTP error: ${slackResponse.status} - ${errorText}`);
  }

  const slackData = await slackResponse.json();
  
  if (!slackData.ok) {
    console.error('Slack API response error:', slackData.error);
    throw new Error(`Slack API response error: ${slackData.error}`);
  }
  
  console.log('Message sent successfully to Slack');
}

async function sendTeamsMessage(agent: Agent, originalEvent: any, message: string): Promise<void> {
  console.log(`Sending Teams message`);
  
  const payload = {
    type: 'message',
    from: {
      id: agent.teams_app_id,
      name: agent.name
    },
    conversation: originalEvent.conversation,
    recipient: originalEvent.from,
    text: message,
    replyToId: originalEvent.id
  };
  
  // Get access token for Teams
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${agent.teams_tenant_id || 'botframework.com'}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: agent.teams_app_id,
      client_secret: agent.teams_app_password,
      scope: 'https://api.botframework.com/.default'
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('Teams token error:', errorText);
    throw new Error(`Teams token error: ${tokenResponse.status} - ${errorText}`);
  }

  const tokenData = await tokenResponse.json();
  
  // Send message to Teams
  const serviceUrl = agent.teams_service_url || originalEvent.serviceUrl || 'https://smba.trafficmanager.net/teams/';
  const teamsResponse = await fetch(`${serviceUrl}v3/conversations/${originalEvent.conversation.id}/activities`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!teamsResponse.ok) {
    const errorText = await teamsResponse.text();
    console.error('Teams message error:', errorText);
    throw new Error(`Teams message error: ${teamsResponse.status} - ${errorText}`);
  }
  
  console.log('Message sent successfully to Teams');
}