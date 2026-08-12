ALTER TABLE timelines 
ADD CONSTRAINT fk_timelines_owner 
FOREIGN KEY (owner_id) 
REFERENCES users(id) 
ON DELETE CASCADE;