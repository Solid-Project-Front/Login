import { SQLiteDatabase } from './src/lib/db/sqlite.ts';
import { hashPassword, verifyPassword } from './src/lib/utils/password.ts';
import { validateUsername, validateEmail, validatePassword } from './src/lib/utils/validation.ts';

async function testProjectFunctions() {
  console.log('🧪 Probando funciones del proyecto...\n');

  // Test 1: Validaciones
  console.log('1️⃣ Probando validaciones:');
  
  const usernameTest = validateUsername('testuser');
  console.log(`   Username válido: ${usernameTest.isValid ? '✅' : '❌'} ${usernameTest.message || ''}`);
  
  const emailTest = validateEmail('test@example.com');
  console.log(`   Email válido: ${emailTest.isValid ? '✅' : '❌'} ${emailTest.message || ''}`);
  
  const passwordTest = validatePassword('TestPass123');
  console.log(`   Password válido: ${passwordTest.isValid ? '✅' : '❌'} ${passwordTest.message || ''}`);

  // Test 2: Hash de contraseñas
  console.log('\n2️⃣ Probando hash de contraseñas:');
  
  const plainPassword = 'TestPassword123';
  const hashedPassword = await hashPassword(plainPassword);
  console.log(`   Hash generado: ✅ ${hashedPassword.substring(0, 20)}...`);
  
  const isValidPassword = await verifyPassword(plainPassword, hashedPassword);
  console.log(`   Verificación correcta: ${isValidPassword ? '✅' : '❌'}`);
  
  const isInvalidPassword = await verifyPassword('WrongPassword', hashedPassword);
  console.log(`   Verificación incorrecta: ${!isInvalidPassword ? '✅' : '❌'}`);

  // Test 3: Base de datos
  console.log('\n3️⃣ Probando base de datos:');
  
  try {
    const db = SQLiteDatabase.getInstance();
    
    // Crear usuario
    const newUser = await db.createUser({
      username: 'testuser2',
      email: 'test2@example.com',
      password: hashedPassword
    });
    console.log(`   Usuario creado: ✅ ID ${newUser.id}`);
    
    // Buscar usuario por username
    const foundUser = await db.findUserByUsername('testuser2');
    console.log(`   Usuario encontrado por username: ${foundUser ? '✅' : '❌'}`);
    
    // Buscar usuario por email
    const foundUserByEmail = await db.findUserByEmail('test2@example.com');
    console.log(`   Usuario encontrado por email: ${foundUserByEmail ? '✅' : '❌'}`);
    
    // Probar token de reset
    const resetToken = 'test_token_123';
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    
    await db.setResetToken('test2@example.com', resetToken, expiry);
    console.log(`   Token de reset establecido: ✅`);
    
    const userByToken = await db.findUserByResetToken(resetToken);
    console.log(`   Usuario encontrado por token: ${userByToken ? '✅' : '❌'}`);
    
    // Limpiar
    await db.deleteUser(newUser.id);
    console.log(`   Usuario eliminado: ✅`);
    
    db.close();
    
  } catch (error) {
    console.log(`   Error en base de datos: ❌ ${error.message}`);
  }

  console.log('\n✨ Pruebas completadas');
}

testProjectFunctions().catch(console.error);