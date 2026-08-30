import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertContactSubmission,
  InsertUser,
  contactSubmissions,
  portfolioProfile,
  portfolioProjects,
  portfolioTechnologies,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  textFields.forEach((field) => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getPortfolioProfile() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(portfolioProfile).limit(1);
  return result[0];
}

export async function getPortfolioTechnologies() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(portfolioTechnologies).orderBy(asc(portfolioTechnologies.sortOrder));
}

export async function getFeaturedProjects() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.isFeatured, 1))
    .orderBy(asc(portfolioProjects.sortOrder));
}

export async function createContactSubmission(input: InsertContactSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const result = await db.insert(contactSubmissions).values(input);
  return { id: result[0].insertId };
}

export async function hasRecentContactSubmission(email: string, windowMinutes = 10) {
  const db = await getDb();
  if (!db) return false;
  const threshold = new Date(Date.now() - windowMinutes * 60 * 1000);
  const result = await db
    .select({ id: contactSubmissions.id })
    .from(contactSubmissions)
    .where(and(eq(contactSubmissions.email, email), eq(contactSubmissions.status, "new")))
    .limit(1);
  return result.length > 0 && threshold.getTime() <= Date.now();
}
