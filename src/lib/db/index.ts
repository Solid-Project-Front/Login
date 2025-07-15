import { SQLiteDatabase } from './sqlite';

// Instancia única de la base de datos
const sqliteDb = SQLiteDatabase.getInstance();

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
    async updatePassword(userId: number, newPassword: string) {
      return sqliteDb.updatePassword(userId, newPassword);
    }
  }
};