import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'collab-fun.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fid INTEGER UNIQUE NOT NULL,
    address TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    role TEXT CHECK(role IN ('User', 'Organization')) DEFAULT 'User',
    interests TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collabs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    emoji TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    max_participants INTEGER NOT NULL,
    host_id INTEGER NOT NULL,
    media_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES users (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collab_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    proof_text TEXT,
    proof_image_url TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (collab_id) REFERENCES collabs (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(collab_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS user_badges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    badge_type TEXT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, badge_type)
  );
`);

// Helper functions
export const getUserById = db.prepare('SELECT * FROM users WHERE id = ?');
export const getUserByFid = db.prepare('SELECT * FROM users WHERE fid = ?');
export const getAllUsers = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
export const createUser = db.prepare(`
  INSERT INTO users (fid, address, name, avatar, role, interests)
  VALUES (?, ?, ?, ?, ?, ?)
`);
export const updateUser = db.prepare(`
  UPDATE users 
  SET name = ?, avatar = ?, role = ?, interests = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

export const getAllCollabs = db.prepare(`
  SELECT c.*, u.name as host_name, u.avatar as host_avatar,
         COUNT(p.id) as participant_count
  FROM collabs c
  LEFT JOIN users u ON c.host_id = u.id
  LEFT JOIN participants p ON c.id = p.collab_id
  WHERE c.end_time > datetime('now')
  GROUP BY c.id
  ORDER BY c.created_at DESC
`);

export const getCollabById = db.prepare(`
  SELECT c.*, u.name as host_name, u.avatar as host_avatar
  FROM collabs c
  LEFT JOIN users u ON c.host_id = u.id
  WHERE c.id = ?
`);

export const createCollab = db.prepare(`
  INSERT INTO collabs (title, emoji, description, category, start_time, end_time, max_participants, host_id, media_url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

export const getCollabParticipants = db.prepare(`
  SELECT p.*, u.name, u.avatar
  FROM participants p
  LEFT JOIN users u ON p.user_id = u.id
  WHERE p.collab_id = ?
  ORDER BY p.joined_at ASC
`);

export const joinCollab = db.prepare(`
  INSERT INTO participants (collab_id, user_id, proof_text, proof_image_url)
  VALUES (?, ?, ?, ?)
`);

export const updateParticipantProof = db.prepare(`
  UPDATE participants 
  SET proof_text = ?, proof_image_url = ?
  WHERE collab_id = ? AND user_id = ?
`);

export const getUserCollabs = db.prepare(`
  SELECT c.*, u.name as host_name, u.avatar as host_avatar,
         COUNT(p.id) as participant_count
  FROM collabs c
  LEFT JOIN users u ON c.host_id = u.id
  LEFT JOIN participants p ON c.id = p.collab_id
  WHERE c.host_id = ?
  GROUP BY c.id
  ORDER BY c.created_at DESC
`);

export const getUserJoinedCollabs = db.prepare(`
  SELECT c.*, u.name as host_name, u.avatar as host_avatar,
         COUNT(p.id) as participant_count,
         p.proof_text, p.proof_image_url, p.joined_at
  FROM participants p
  LEFT JOIN collabs c ON p.collab_id = c.id
  LEFT JOIN users u ON c.host_id = u.id
  LEFT JOIN participants p2 ON c.id = p2.collab_id
  WHERE p.user_id = ?
  GROUP BY c.id, p.id
  ORDER BY p.joined_at DESC
`);

export const getUserStats = db.prepare(`
  SELECT 
    (SELECT COUNT(*) FROM collabs WHERE host_id = ?) as collabs_hosted,
    (SELECT COUNT(*) FROM participants WHERE user_id = ?) as collabs_joined,
    (SELECT COUNT(*) FROM participants WHERE user_id = ? AND proof_text IS NOT NULL) as proofs_submitted
`);

export const addBadge = db.prepare(`
  INSERT OR IGNORE INTO user_badges (user_id, badge_type)
  VALUES (?, ?)
`);

export const getUserBadges = db.prepare(`
  SELECT badge_type, earned_at
  FROM user_badges
  WHERE user_id = ?
  ORDER BY earned_at DESC
`);

export default db;
