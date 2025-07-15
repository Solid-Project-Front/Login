import { SQLiteDatabase } from './sqlite';

// Instancia única de la base de datos
const sqliteDb = SQLiteDatabase.getInstance();

// Interfaz pública de la base de datos
export const db = {
  user: {
    async create({ data }: { data: { username: string; password: string } }) {
      return sqliteDb.createUser(data);
    },
    async findUnique({ where }: { where: { username?: string; id?: number } }) {
      if (where.username) {
        return sqliteDb.findUserByUsername(where.username);
      } else if (where.id) {
        return sqliteDb.findUserById(where.id);
      }
      return null;
    },
    async findAll() {
      return sqliteDb.getAllUsers();
    },
    async update(id: number, data: Partial<{ username: string; password: string }>) {
      return sqliteDb.updateUser(id, data);
    },
    async delete(id: number) {
      return sqliteDb.deleteUser(id);
    }
  }
}; 