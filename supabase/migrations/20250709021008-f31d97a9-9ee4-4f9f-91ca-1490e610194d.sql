-- Add context data field to agents table
ALTER TABLE public.agents 
ADD COLUMN context_data TEXT;