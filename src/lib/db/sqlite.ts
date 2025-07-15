import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { eq, sql } from 'drizzle-orm';

// Definición de tipos
export interface User {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
}

export type NewUser = Omit<User, 'id' | 'createdAt'>;

// Esquema de la base de datos
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Clase principal de la base de datos SQLite
export class SQLiteDatabase {
  private static instance: SQLiteDatabase;
  private db: ReturnType<typeof drizzle>;
  private sqlite: Database.Database;
  // Constructor privado - no permite crear instancias directamente
  private constructor() {
    this.sqlite = new Database('sqlite.db');
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
      return {
        ...data,
        id: Number(result.lastInsertRowid),
        createdAt: new Date()
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Could not create user');
    }
  }

  public async findUserByUsername(username: string): Promise<User | null> {
    try {
      return this.db.select().from(users).where(eq(users.username, username)).get() || null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Could not find user');
    }
  }

  public async findUserById(id: number): Promise<User | null> {
    try {
      return this.db.select().from(users).where(eq(users.id, id)).get() || null;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new Error('Could not find user');
    }
  }

  public async getAllUsers(): Promise<User[]> {
    try {
      return this.db.select().from(users).all();
    } catch (error) {
      console.error('Error finding users:', error);
      throw new Error('Could not find users');
    }
  }

  public async updateUser(id: number, data: Partial<NewUser>): Promise<void> {
    try {
      await this.db.update(users)
        .set(data)
        .where(eq(users.id, id))
        .run();
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Could not update user');
    }
  }

  public async deleteUser(id: number): Promise<void> {
    try {
      await this.db.delete(users)
        .where(eq(users.id, id))
        .run();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Could not delete user');
    }
  }

  public close(): void {
    this.sqlite.close();
  }
} 