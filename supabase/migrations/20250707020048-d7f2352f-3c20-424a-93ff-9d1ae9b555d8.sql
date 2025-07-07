-- Add Slack configuration fields to agents table
ALTER TABLE public.agents 
ADD COLUMN slack_bot_token TEXT,
ADD COLUMN slack_signing_secret TEXT,
ADD COLUMN openai_api_key TEXT;