import express, { Request, Response, NextFunction } from "express"; // Import Express and types
import Database from "better-sqlite3"; // SQLite database driver
import cors from "cors"; // Middleware to allow cross-origin requests
import { User, Member } from "./types"; // Import TypeScript interfaces

// --- Initialize Express ---
const app = express();

// --- Middleware ---
// Enable CORS so frontend can call backend
app.use(cors());
// Parse JSON request bodies automatically
app.use(express.json());

// --- Initialize SQLite Database ---
// Opens (or creates if not exist) gym.db in the backend folder
const db = new Database("gym.db");

// --- Create tables if they don't exist ---
// Users table: stores username and password (plain text for prototype)
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).run();

// Members table: stores gym members and their subscription type
db.prepare(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subscriptionType TEXT NOT NULL
  )
`).run();

// Add a test user (only run once)
const existing = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!existing) {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("admin", "password123");
  console.log("✅ Test user created: admin / password123");
}


// --- Authentication Middleware ---
// Checks if a request has a valid "token" in Authorization header
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); // 401 = Unauthorized

  // Fake token = username
  const token = authHeader.replace("Bearer ", "");
  // Look up user by username
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(token) as User | undefined;

  if (!user) return res.sendStatus(403); // 403 = Forbidden if user not found

  // Attach user to request for later use
  (req as any).user = user;
  next();
}

// --- Register Endpoint ---
// POST /api/auth/register
// Body: { username, password }
app.post("/api/auth/register", (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Missing fields" }); // Bad request if missing data

  try {
    // Insert new user into database
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    const result = stmt.run(username, password);
    res.status(201).json({ id: result.lastInsertRowid, username }); // Return created user ID
  } catch {
    res.status(400).json({ error: "Username already exists" }); // Catch duplicate usernames
  }
});

// --- Login Endpoint ---
// POST /api/auth/login
// Body: { username, password }
// Returns a "token" (username in this prototype)
app.post("/api/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Look for user in DB matching username & password
  const user = db.prepare(
    "SELECT * FROM users WHERE username = ? AND password = ?"
  ).get(username, password) as User | undefined;

  if (!user) return res.status(401).json({ error: "Invalid credentials" }); // Unauthorized if no match

  // Fake token = just the username
  res.json({ token: username });
});

// --- Members Endpoints ---
// GET all members (protected route)
app.get("/api/members", authMiddleware, (req: Request, res: Response) => {
  // Retrieve all members from DB and cast to Member[]
  const members = db.prepare("SELECT * FROM members").all() as Member[];
  res.json(members);
});

// POST new member (protected route)
app.post("/api/members", authMiddleware, (req: Request, res: Response) => {
  const { name, subscriptionType } = req.body as Omit<Member, "id">; // Ignore ID for insertion
  const stmt = db.prepare("INSERT INTO members (name, subscriptionType) VALUES (?, ?)");
  const result = stmt.run(name, subscriptionType);
  // Return the new member with assigned ID
  res.status(201).json({ id: result.lastInsertRowid, name, subscriptionType });
});

// DELETE a member by ID (protected route)
app.delete("/api/members/:id", authMiddleware, (req: Request, res: Response) => {
  db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  res.sendStatus(204); // 204 = No Content, successful deletion
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
// Server listens on port 5000