-- Add platform support and Teams configuration to agents table
ALTER TABLE public.agents 
ADD COLUMN platform TEXT[] DEFAULT ARRAY['slack'], -- Array to support multiple platforms
ADD COLUMN teams_app_id TEXT,
ADD COLUMN teams_app_password TEXT,
ADD COLUMN teams_tenant_id TEXT,
ADD COLUMN teams_service_url TEXT;