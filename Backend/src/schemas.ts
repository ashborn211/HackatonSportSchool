import { db } from "./db";

// ------------------------
// Create Tables
// ------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS SubscriptionType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  hoursPerWeek INTEGER NOT NULL
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS Course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  subscriptionId INTEGER NOT NULL,
  FOREIGN KEY(subscriptionId) REFERENCES SubscriptionType(id)
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS PersonalTrainer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  availableHours INTEGER NOT NULL
)
`).run();

// ------------------------
// Seed Subscription Types
// ------------------------
const subscriptionCount = (db
  .prepare("SELECT COUNT(*) AS count FROM SubscriptionType")
  .get() as any).count;

if (subscriptionCount === 0) {
  const insert = db.prepare("INSERT INTO SubscriptionType (name, hoursPerWeek) VALUES (?, ?)");
  insert.run("1x per week", 1);
  insert.run("2x per week", 2);
  insert.run("Unlimited", 7);
  insert.run("Add-on", 0);
  console.log("✅ Subscription types seeded");
}

// ------------------------
// Seed Courses
// ------------------------
const courseCount = (db.prepare("SELECT COUNT(*) AS count FROM Course").get() as any).count;

if (courseCount === 0) {
  const insert = db.prepare("INSERT INTO Course (name) VALUES (?)");
  ["Yoga", "Pilates", "Paaldansen"].forEach(c => insert.run(c));
  console.log("✅ Courses seeded");
}

// ------------------------
// Seed Personal Trainers
// ------------------------
const trainerCount = (db.prepare("SELECT COUNT(*) AS count FROM PersonalTrainer").get() as any).count;

if (trainerCount === 0) {
  const insert = db.prepare("INSERT INTO PersonalTrainer (name, availableHours) VALUES (?, ?)");
  insert.run("Alice", 10);
  insert.run("Bob", 15);
  console.log("✅ Personal trainers seeded");
}
