-- Add context file path field to agents table
ALTER TABLE public.agents 
ADD COLUMN context_file_path TEXT;