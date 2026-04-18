from db import execute_query
import config

execute_query("INSERT INTO roadmap_features (title, description, status) VALUES ('Partial Backend Shift to Supabase', 'Migrate Authentication and User Database handling entirely to Supabase Postgres as suggested, leaving the complex Python scraping engine exclusively as a connected microservice.', 'planned')")
print('SUCCESS!')
