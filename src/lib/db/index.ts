import { SQLiteDatabase } from './sqlite';

// Instancia de la base de datos
const sqliteDb = new SQLiteDatabase();

// Interfaz pública de la base de datos
export const db = {
  user: {
    async create({ data }: { data: { username: string; email: string; password: string } }) {
      return sqliteDb.createUser(data);
    },
    async findUnique({ where }: { where: { username?: string; email?: string; id?: number } }) {
      if (where.username) {
        return sqliteDb.findUserByUsername(where.username);
      } else if (where.email) {
        return sqliteDb.findUserByEmail(where.email);
      } else if (where.id) {
        return sqliteDb.findUserById(where.id);
      }
      return null;
    },
    async findByUsername(username: string) {
      return sqliteDb.findUserByUsername(username);
    },
    async findByEmail(email: string) {
      return sqliteDb.findUserByEmail(email);
    },
    async findById(id: number) {
      return sqliteDb.findUserById(id);
    },
    async findAll() {
      return sqliteDb.getAllUsers();
    },
    async update(id: number, data: Partial<{ username: string; email: string; password: string }>) {
      return sqliteDb.updateUser(id, data);
    },
    async delete(id: number) {
      return sqliteDb.deleteUser(id);
    },
    async setResetToken(email: string, token: string, expiry: Date) {
      return sqliteDb.setResetToken(email, token, expiry);
    },
    async findByResetToken(token: string) {
      return sqliteDb.findUserByResetToken(token);
    },
    async clearResetToken(userId: number) {
      return sqliteDb.clearResetToken(userId);
    },
    async resetUserPassword(userId: number, newPassword: string) {
      return sqliteDb.resetUserPassword(userId, newPassword);
    }
  }
};