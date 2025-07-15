import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { eq, sql } from "drizzle-orm";

// Definición de tipos
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

export type NewUser = Omit<User, "id" | "createdAt">;

// Esquema de la base de datos
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`datetime('now')`),
});

// Clase principal de la base de datos SQLite
export class SQLiteDatabase {
  private static instance: SQLiteDatabase;
  private db: ReturnType<typeof drizzle>;
  private sqlite: Database.Database;

  // Constructor privado - no permite crear instancias directamente
  private constructor() {
    this.sqlite = new Database("sqlite.db");
    this.db = drizzle(this.sqlite);
  }

  // Método público para obtener la instancia
  public static getInstance(): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      SQLiteDatabase.instance = new SQLiteDatabase();
    }
    return SQLiteDatabase.instance;
  }

  public async createUser(data: NewUser): Promise<User> {
    try {
      const result = this.db.insert(users).values(data).run();
      const id = Number(result.lastInsertRowid);
      const row = this.db.select().from(users).where(eq(users.id, id)).get();
      if (!row || !row.createdAt) {
        throw new Error("User created but could not retrieve data");
      }
      return {
        ...row,
        createdAt: new Date(row.createdAt),
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Could not create user");
    }
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    try {
      const row = this.db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .get();
      return row && row.createdAt
        ? { ...row, createdAt: new Date(row.createdAt) }
        : null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Could not find user");
    }
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    try {
      const row = this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .get();
      return row && row.createdAt
        ? { ...row, createdAt: new Date(row.createdAt) }
        : null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Could not find user");
    }
  }

  public async findUserById(id: number): Promise<User | null> {
    try {
      const row = this.db.select().from(users).where(eq(users.id, id)).get();
      return row && row.createdAt
        ? { ...row, createdAt: new Date(row.createdAt) }
        : null;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Could not find user");
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      const rows = this.db.select().from(users).all();
      return rows.map((row) => ({
        ...row,
        createdAt: new Date(row.createdAt!),
      }));
    } catch (error) {
      console.error("Error finding users:", error);
      throw new Error("Could not find users");
    }
  }

  public async updateUser(id: number, data: Partial<NewUser>): Promise<void> {
    try {
      await this.db.update(users).set(data).where(eq(users.id, id)).run();
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Could not update user");
    }
  }

  public async deleteUser(id: number): Promise<void> {
    try {
      await this.db.delete(users).where(eq(users.id, id)).run();
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Could not delete user");
    }
  }

  public close(): void {
    this.sqlite.close();
  }
}
