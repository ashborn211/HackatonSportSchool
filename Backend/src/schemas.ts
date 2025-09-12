import { db } from "./db";

// ------------------------
// Create Tables
// ------------------------
db.prepare(`
CREATE TABLE IF NOT EXISTS SubscriptionType (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  timesPerWeek INTEGER NOT NULL
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS Subscription (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscriptionTypeId INTEGER NOT NULL,
  userId INTEGER NOT NULL,
  FOREIGN KEY(subscriptionTypeId) REFERENCES SubscriptionType(id),
  FOREIGN KEY(userId) REFERENCES User(id)
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS Course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS SubscriptionCourseJoint (
  subscriptionId INTEGER NOT NULL,
  courseId INTEGER NOT NULL,
  PRIMARY KEY (subscriptionId, courseId),
  FOREIGN KEY(subscriptionId) REFERENCES Subscription(id),
  FOREIGN KEY(courseId) REFERENCES Course(id)
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
`).run();


db.prepare(`
CREATE TABLE IF NOT EXISTS PersonalTrainer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS PersonalTrainerAppointment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  trainerId INTEGER NOT NULL,
  appointmentDate TEXT NOT NULL, -- store as ISO string
  FOREIGN KEY(userId) REFERENCES User(id),
  FOREIGN KEY(trainerId) REFERENCES PersonalTrainer(id)
);
`).run();

// ------------------------
// Seed Subscription Types
// ------------------------
const subscriptionTypeCount = (db
  .prepare("SELECT COUNT(*) AS count FROM SubscriptionType")
  .get() as any).count;

if (subscriptionTypeCount === 0) {
  const insert = db.prepare("INSERT INTO SubscriptionType (name, timesPerWeek) VALUES (?, ?)");
  insert.run("1x per week", 1);
  insert.run("2x per week", 2);
  insert.run("Unlimited", 7);
  insert.run("Add-on", 0);
  console.log("\u2705 Subscription types seeded");
}

// ------------------------
// Seed Users
// ------------------------
const userCount = (db.prepare("SELECT COUNT(*) AS count FROM User").get() as any).count;

if (userCount === 0) {
  const insert = db.prepare("INSERT INTO User (name, email, password) VALUES (?, ?, ?)");
  insert.run("John Doe", "john@example.com", "password123");
  insert.run("Jane Smith", "jane@example.com", "password456");
  console.log("\u2705 Users seeded");
}

// ------------------------
// Seed Subscriptions
// ------------------------
const subscriptionCount = (db.prepare("SELECT COUNT(*) AS count FROM Subscription").get() as any).count;

if (subscriptionCount === 0) {
  const insert = db.prepare("INSERT INTO Subscription (subscriptionTypeId, userId) VALUES (?, ?)");

  const types = db.prepare("SELECT id, name FROM SubscriptionType").all() as any[];
  const users = db.prepare("SELECT id, name FROM User").all() as any[];

  const unlimited = types.find(t => t.name === "Unlimited")?.id;
  const twoPerWeek = types.find(t => t.name === "2x per week")?.id;

  const john = users.find(u => u.name === "John Doe")?.id;
  const jane = users.find(u => u.name === "Jane Smith")?.id;

  if (unlimited && john) 
  {
    insert.run(unlimited, john)

  };

  if (twoPerWeek && jane) 
  {
    insert.run(twoPerWeek, jane);
  }

  console.log("\u2705 Subscriptions seeded");
}

// ------------------------
// Seed Courses
// ------------------------
const courseCount = (db.prepare("SELECT COUNT(*) AS count FROM Course").get() as any).count;

if (courseCount === 0) {
  const insert = db.prepare("INSERT INTO Course (name) VALUES (?)");
  insert.run("Yoga");
  insert.run("Pilates");
  insert.run("Paaldansen");
  console.log("\u2705 Courses seeded");
}

// ------------------------
// Seed Personal Trainers
// ------------------------
const trainerCount = (db.prepare("SELECT COUNT(*) AS count FROM PersonalTrainer").get() as any).count;

if (trainerCount === 0) {
  const insert = db.prepare("INSERT INTO PersonalTrainer (name) VALUES (?)");
  insert.run("Alice");
  insert.run("Bob");
  console.log("\u2705 Personal trainers seeded");
}

// ------------------------
// Seed Subscription ↔ Course Joint Table
// ------------------------
const jointCount = (db.prepare("SELECT COUNT(*) AS count FROM SubscriptionCourseJoint").get() as any).count;

if (jointCount === 0) {
  const insert = db.prepare("INSERT INTO SubscriptionCourseJoint (subscriptionId, courseId) VALUES (?, ?)");

  const subscriptions = db.prepare(`
    SELECT s.id AS subscriptionId, st.name AS typeName
    FROM Subscription s
    JOIN SubscriptionType st ON s.subscriptionTypeId = st.id
  `).all() as any[];

  const courses = db.prepare("SELECT id, name FROM Course").all() as any[];

  const yoga = courses.find(c => c.name === "Yoga")?.id;
  const pilates = courses.find(c => c.name === "Pilates")?.id;
  const paaldansen = courses.find(c => c.name === "Paaldansen")?.id;

  for (var i = 0; i < subscriptions.length; i++) {
    const sub = subscriptions[i];
    if(i%3==0){
      if (yoga) insert.run(sub.subscriptionId, yoga);
    } else if(i%3==1){
      if (pilates) insert.run(sub.subscriptionId, pilates);
    } else {
      if (paaldansen) insert.run(sub.subscriptionId, paaldansen);
    }
  }

  console.log("\u2705 SubscriptionCourseJoint seeded");
}
