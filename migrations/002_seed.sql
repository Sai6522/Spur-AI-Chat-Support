-- Seed data for testing
-- Insert sample conversations and messages

-- Sample conversation 1
INSERT INTO conversations (id, created_at) VALUES 
('sample-conv-1', CURRENT_TIMESTAMP);

INSERT INTO messages (conversation_id, sender, text, timestamp) VALUES 
('sample-conv-1', 'user', 'What are your store hours?', CURRENT_TIMESTAMP),
('sample-conv-1', 'ai', 'Our store hours are Monday-Friday 9AM-6PM EST. We''re here to help during those times!', CURRENT_TIMESTAMP);

-- Sample conversation 2  
INSERT INTO conversations (id, created_at) VALUES 
('sample-conv-2', CURRENT_TIMESTAMP);

INSERT INTO messages (conversation_id, sender, text, timestamp) VALUES 
('sample-conv-2', 'user', 'What is your return policy?', CURRENT_TIMESTAMP),
('sample-conv-2', 'ai', 'We offer a 30-day return policy. Items must be in original condition with tags attached.', CURRENT_TIMESTAMP);
