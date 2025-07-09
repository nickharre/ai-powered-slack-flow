import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Agent {
  id: string;
  name: string;
  slack_channel: string;
  slack_workspace: string;
  slack_bot_token: string;
  slack_signing_secret: string;
  openai_api_key: string;
  ai_model: string;
  system_prompt: string;
  trigger_keywords: string[];
  trigger_mentions: boolean;
  trigger_all_messages: boolean;
  response_template: string;
  is_active: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Slack webhook received:', req.method, req.url);
    
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
    
    let slackEvent;
    
    try {
      slackEvent = JSON.parse(body);
    } catch (e) {
      console.error('Failed to parse Slack event:', e);
      console.error('Raw body was:', body);
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
    }

    console.log('Slack event received:', slackEvent);

    // Handle Slack URL verification challenge
    if (slackEvent.type === 'url_verification') {
      console.log('URL verification challenge received:', slackEvent.challenge);
      return new Response(slackEvent.challenge, {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Handle Slack events
    if (slackEvent.type === 'event_callback' && slackEvent.event) {
      const event = slackEvent.event;
      
      // Skip bot messages to avoid loops
      if (event.bot_id || event.user === 'USLACKBOT') {
        return new Response('OK', { headers: corsHeaders });
      }

      // Only handle message events
      if (event.type !== 'message' || !event.text) {
        return new Response('OK', { headers: corsHeaders });
      }

      // Get the team/workspace ID
      const teamId = slackEvent.team_id;
      
      // Find active agents that could respond to this message
      // Note: We're using service role key so we can access all agents
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true);

      if (agentsError) {
        console.error('Error fetching agents:', agentsError);
        return new Response('Error fetching agents', { status: 500, headers: corsHeaders });
      }

      if (!agents || agents.length === 0) {
        console.log('No active agents found');
        return new Response('OK', { headers: corsHeaders });
      }

      // Process each agent that might respond
      for (const agent of agents as Agent[]) {
        const shouldRespond = await checkIfAgentShouldRespond(agent, event);
        
        if (shouldRespond) {
          console.log(`Agent ${agent.name} should respond to message`);
          
          // Generate AI response
          try {
            const aiResponse = await generateAIResponse(agent, event.text);
            
            // Send response to Slack
            await sendSlackMessage(agent, event.channel, aiResponse);
            
            console.log(`Agent ${agent.name} responded successfully`);
          } catch (error) {
            console.error(`Error processing agent ${agent.name}:`, error);
          }
        }
      }
    }

    return new Response('OK', { headers: corsHeaders });
  } catch (error) {
    console.error('Error in slack-webhook function:', error);
    return new Response('Internal Server Error', { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});

async function checkIfAgentShouldRespond(agent: Agent, event: any): Promise<boolean> {
  const message = event.text.toLowerCase();
  
  // Check if agent responds to all messages
  if (agent.trigger_all_messages) {
    return true;
  }
  
  // Check for @mentions (basic check - you might want to improve this)
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
          content: agent.system_prompt || 'You are a helpful AI assistant in a Slack workspace. Be concise and friendly.'
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
  console.log(`Attempting to send message to channel: ${channel}`);
  console.log(`Message length: ${message.length}`);
  console.log(`Bot token starts with: ${agent.slack_bot_token?.substring(0, 10)}...`);
  
  const payload = {
    channel: channel,
    text: message,
  };
  
  console.log('Slack API payload:', JSON.stringify(payload, null, 2));
  
  const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${agent.slack_bot_token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  console.log(`Slack API response status: ${slackResponse.status}`);
  
  if (!slackResponse.ok) {
    const errorText = await slackResponse.text();
    console.error('Slack HTTP error:', errorText);
    throw new Error(`Slack HTTP error: ${slackResponse.status} - ${errorText}`);
  }

  const slackData = await slackResponse.json();
  console.log('Slack API response:', JSON.stringify(slackData, null, 2));
  
  if (!slackData.ok) {
    console.error('Slack API response error:', slackData.error);
    console.error('Full Slack response:', slackData);
    throw new Error(`Slack API response error: ${slackData.error}`);
  }
  
  console.log('Message sent successfully to Slack');
}