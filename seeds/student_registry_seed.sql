-- Seed the Student Registry with real-world institutional data
-- Run this in your Supabase SQL Editor

INSERT INTO public.student_registry (college_id, full_name, college, major, year, avatar_url)
VALUES 
  ('IIT-AD-001', 'Aditya Yadav', 'IIT Delhi', 'Computer Science', '2024', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya'),
  ('BITS-SN-002', 'Sneha Reddy', 'BITS Pilani', 'Electrical Engineering', '2025', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'),
  ('DTU-RJ-003', 'Rohan Joshi', 'Delhi Technological University', '2024', 'Software Engineering', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan'),
  ('NSUT-AK-004', 'Ananya Kapoor', 'NSUT Delhi', '2026', 'Information Technology', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya'),
  ('IIIT-MS-005', 'Meera Sharma', 'IIIT Hyderabad', '2024', 'Computer Science', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meera');
