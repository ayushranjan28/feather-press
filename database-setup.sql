-- MySQL Database Setup for Chryp Lite
-- Run this script to create the database and tables

-- Create database (uncomment if you need to create the database)
-- CREATE DATABASE IF NOT EXISTS chryp_lite;
-- USE chryp_lite;

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_title (title)
);

-- Insert sample data (optional)
INSERT INTO posts (title, content) VALUES 
('Welcome to Chryp Lite', 'This is your first post! You can edit or delete it from the admin panel.'),
('Getting Started', 'Chryp Lite is now connected to MySQL database. You can create, read, update, and delete posts through the API.');

-- Show the created table structure
DESCRIBE posts;

-- Show sample data
SELECT * FROM posts;
