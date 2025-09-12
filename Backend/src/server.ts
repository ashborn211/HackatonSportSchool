import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { db } from "./db";
import "./schemas"; // Create tables and seed data
import { User } from "./types";

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------
// Auth Middleware
// ------------------------
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.replace("Bearer ", "");
  const user = db.prepare("SELECT * FROM User WHERE email = ?").get(token) as User | undefined;

  if (!user) return res.sendStatus(403);

  (req as any).user = user;
  next();
}

// ------------------------
// Routes
// ------------------------

// Register a new user
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, subscriptionId } = req.body;
  if (!name || !email || !password || !subscriptionId)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const result = db.prepare(
      "INSERT INTO User (name, email, password, subscriptionId) VALUES (?, ?, ?, ?)"
    ).run(name, email, password, subscriptionId);
    res.status(201).json({ id: result.lastInsertRowid, name, email, subscriptionId });
  } catch {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Tell TypeScript the query will return UserRow | undefined
  const user = db
    .prepare("SELECT * FROM User WHERE email = ? AND password = ?")
    .get(email, password);

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Return a token (just the email for prototype) 
  res.json({ token: email});
});

// List all members
app.get("/api/members", authMiddleware, (req, res) => {
  const members = db.prepare(`
    SELECT U.id, U.name, U.email, S.name AS subscription
    FROM User U
    JOIN SubscriptionType S ON U.subscriptionId = S.id
  `).all();
  res.json(members);
});

// List all subscription types
app.get("/api/subscriptions", authMiddleware, (req, res) => {
  const subs = db.prepare("SELECT * FROM SubscriptionType").all();
  res.json(subs);
});

// List all courses
app.get("/api/courses", authMiddleware, (req, res) => {
  const courses = db.prepare("SELECT * FROM Course").all();
  res.json(courses);
});

// List personal trainers
app.get("/api/trainers", authMiddleware, (req, res) => {
  const trainers = db.prepare("SELECT * FROM PersonalTrainer").all();
  res.json(trainers);
});

// ------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`\u2705 API running on http://localhost:${PORT}`));
