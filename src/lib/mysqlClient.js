import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Database configuration

const shouldUseSsl = String(process.env.MYSQL_SSL || '').toLowerCase() === 'true';
const rejectUnauthorized = String(process.env.MYSQL_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() === 'true';
const caPath = process.env.MYSQL_SSL_CA_PATH ? path.resolve(process.env.MYSQL_SSL_CA_PATH) : undefined;
let sslConfig = undefined;
if (shouldUseSsl) {
  sslConfig = { rejectUnauthorized };
  if (caPath && fs.existsSync(caPath)) {
    try {
      sslConfig.ca = fs.readFileSync(caPath, 'utf8');
    } catch {}
  }
}

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'chryp_lite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: sslConfig,
};

// Create connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL connection failed:', error);
    return false;
  }
}

// Initialize database and create tables if they don't exist
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      )
    `);

    // Create posts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(255) NULL,
        image_url VARCHAR(500) NULL,
        tags VARCHAR(500) NULL,
        likes INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create quotes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text TEXT NOT NULL,
        author VARCHAR(255) NULL,
        created_by VARCHAR(255) NULL,
        category VARCHAR(255) NULL,
        tags VARCHAR(500) NULL,
        likes INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Create generic comments table that works with any content type
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content_type ENUM('post', 'quote', 'video', 'gallery') NOT NULL,
        content_id INT NOT NULL,
        author VARCHAR(255) NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_content (content_type, content_id),
        INDEX idx_created_at (created_at)
      )
    `);
    // Create galleries table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS galleries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        created_by VARCHAR(255) NULL,
        images JSON NOT NULL,
        tags VARCHAR(500) NULL,
        likes INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_created_by (created_by),
        INDEX idx_created_at (created_at)
      )
    `);
    // Create videos table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NULL,
        description TEXT NULL,
        created_by VARCHAR(255) NULL,
        source VARCHAR(20) NOT NULL, -- 'upload' or 'url'
        url TEXT NOT NULL,
        tags VARCHAR(500) NULL,
        likes INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_videos_created_by (created_by),
        INDEX idx_videos_created_at (created_at)
      )
    `);
    // Create audios table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS audios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        created_by VARCHAR(255) NULL,
        source VARCHAR(20) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_audios_created_by (created_by),
        INDEX idx_audios_created_at (created_at)
      )
    `);
    // Create photos table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS photos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        description TEXT NULL,
        photographer VARCHAR(255) NULL,
        created_by VARCHAR(255) NULL,
        category VARCHAR(255) NULL,
        tags VARCHAR(500) NULL,
        likes INT NOT NULL DEFAULT 0,
        views INT NOT NULL DEFAULT 0,
        downloads INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Try to add author column if table already existed without it
    try {
      await connection.execute('ALTER TABLE posts ADD COLUMN author VARCHAR(255) NULL');
    } catch (e) {
      // ignore if column exists
    }
    // Try to add likes column if table already existed without it
    try {
      await connection.execute('ALTER TABLE posts ADD COLUMN likes INT NOT NULL DEFAULT 0');
    } catch (e) {
      // ignore if column exists
    }
    
    // Try to add likes column to quotes if table already existed without it
    try {
      await connection.execute('ALTER TABLE quotes ADD COLUMN likes INT NOT NULL DEFAULT 0');
    } catch (e) {
      // ignore if column exists
    }
    
    // Try to add likes column to videos if table already existed without it
    try {
      await connection.execute('ALTER TABLE videos ADD COLUMN likes INT NOT NULL DEFAULT 0');
    } catch (e) {
      // ignore if column exists
    }
    
    // Try to add likes column to galleries if table already existed without it
    try {
      await connection.execute('ALTER TABLE galleries ADD COLUMN likes INT NOT NULL DEFAULT 0');
    } catch (e) {
      // ignore if column exists
    }

    // Try to add tags columns if missing
    try { await connection.execute('ALTER TABLE posts ADD COLUMN tags VARCHAR(500) NULL'); } catch (e) {}
    try { await connection.execute('ALTER TABLE videos ADD COLUMN tags VARCHAR(500) NULL'); } catch (e) {}
    try { await connection.execute('ALTER TABLE galleries ADD COLUMN tags VARCHAR(500) NULL'); } catch (e) {}
    
    // Try to migrate existing comments table to new structure
    try {
      // Check if old comments table exists with post_id column
      const [oldComments] = await connection.execute("SHOW COLUMNS FROM comments LIKE 'post_id'");
      if (oldComments.length > 0) {
        // Create new comments table with new structure
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS comments_new (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content_type ENUM('post', 'quote', 'video', 'gallery') NOT NULL,
            content_id INT NOT NULL,
            author VARCHAR(255) NULL,
            text TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_content (content_type, content_id),
            INDEX idx_created_at (created_at)
          )
        `);
        
        // Migrate existing comments to new structure
        await connection.execute(`
          INSERT INTO comments_new (id, content_type, content_id, author, text, created_at)
          SELECT id, 'post', post_id, author, text, created_at FROM comments
        `);
        
        // Drop old table and rename new one
        await connection.execute('DROP TABLE comments');
        await connection.execute('RENAME TABLE comments_new TO comments');
      }
    } catch (e) {
      // ignore if migration fails
    }
    
    // Create default admin user if it doesn't exist
    try {
      await connection.execute(`
        INSERT IGNORE INTO users (username, password, email, role) VALUES 
        ('CloneFest2025', 'CloneFest2025', 'admin@chryplite.com', 'admin'),
        ('demo', 'demo123', 'demo@chryplite.com', 'user')
      `);
    } catch (e) {
      console.log('Default users may already exist');
    }
    
    console.log('Database tables initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}

export default pool;
