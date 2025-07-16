import Database from 'better-sqlite3';
import fs from 'fs';

// Eliminar base de datos si existe
try {
  if (fs.existsSync('test.db')) {
    fs.unlinkSync('test.db');
  }
} catch (e) {
  console.log('No se pudo eliminar la base de datos existente');
}

// Crear nueva base de datos
const db = new Database('test.db');

// Crear tabla de usuarios
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    reset_token TEXT,
    reset_token_expiry TEXT,
    created_at TEXT DEFAULT (datetime('now')) NOT NULL
  )
`);

console.log('✅ Base de datos de prueba creada exitosamente');

// Insertar usuario de prueba
const insert = db.prepare(`
  INSERT INTO users (username, email, password) 
  VALUES (?, ?, ?)
`);

insert.run('testuser', 'test@example.com', 'hashedpassword123');

console.log('✅ Usuario de prueba insertado');

// Consultar usuarios
const users = db.prepare('SELECT * FROM users').all();
console.log('👥 Usuarios en la base de datos:', users);

db.close();
console.log('✅ Prueba de base de datos completada');