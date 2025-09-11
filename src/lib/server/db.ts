import Database from "better-sqlite3";
import { mkdirSync } from "fs";

// ensure uploads folder exists
mkdirSync("static/uploads", { recursive: true });

const db = new Database("projects.db");

// create tables if not exist
db.exec(`
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    createdDate TEXT NOT NULL,
    tags TEXT
);

CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    uploadDate TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE
);
`);

export default db;
