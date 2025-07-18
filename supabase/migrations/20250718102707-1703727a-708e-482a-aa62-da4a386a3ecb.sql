-- Create a table to track processed messages to prevent duplicates
CREATE TABLE IF NOT EXISTS public.processed_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, channel_id, platform)
);

-- Enable RLS
ALTER TABLE public.processed_messages ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_processed_messages_lookup 
ON public.processed_messages(message_id, channel_id, platform);

-- Auto-cleanup old entries (older than 24 hours) to prevent table bloat
CREATE OR REPLACE FUNCTION public.cleanup_old_processed_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.processed_messages 
  WHERE processed_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-cleanup on new inserts
CREATE OR REPLACE FUNCTION public.trigger_cleanup_processed_messages()
RETURNS trigger AS $$
BEGIN
  -- Only cleanup every 100th insert to avoid performance impact
  IF (NEW.id::text ~ '[0-9]00$') THEN
    PERFORM public.cleanup_old_processed_messages();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_processed_messages_trigger
  AFTER INSERT ON public.processed_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_cleanup_processed_messages();