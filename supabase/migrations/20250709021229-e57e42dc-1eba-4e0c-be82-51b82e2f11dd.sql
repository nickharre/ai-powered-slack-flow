-- Create storage bucket for agent context files
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-context', 'agent-context', false);

-- Create storage policies for agent context files
CREATE POLICY "Users can view their own context files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'agent-context' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own context files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'agent-context' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own context files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'agent-context' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own context files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'agent-context' AND auth.uid()::text = (storage.foldername(name))[1]);