import { loginRateLimiter, passwordResetRateLimiter } from './src/lib/utils/rate-limiter.ts';

async function testRateLimiter() {
  console.log('🧪 Probando Rate Limiter...\n');

  const testUser = 'testuser';
  const testEmail = 'test@example.com';

  // Test 1: Login Rate Limiter
  console.log('1️⃣ Probando Login Rate Limiter:');
  
  // Simular intentos fallidos
  for (let i = 1; i <= 6; i++) {
    const isBlocked = loginRateLimiter.isBlocked(testUser);
    console.log(`   Intento ${i} - Bloqueado: ${isBlocked ? '🚫' : '✅'}`);
    
    if (!isBlocked) {
      loginRateLimiter.recordAttempt(testUser, false);
      const remaining = loginRateLimiter.getRemainingAttempts(testUser);
      console.log(`   Intentos restantes: ${remaining}`);
    } else {
      const blockedUntil = loginRateLimiter.getBlockedUntil(testUser);
      if (blockedUntil) {
        const minutes = Math.ceil((blockedUntil.getTime() - Date.now()) / (1000 * 60));
        console.log(`   Bloqueado por ${minutes} minutos`);
      }
      break;
    }
  }

  // Test 2: Intento exitoso después de bloqueo
  console.log('\n   Simulando intento exitoso...');
  loginRateLimiter.recordAttempt(testUser, true);
  const isBlockedAfterSuccess = loginRateLimiter.isBlocked(testUser);
  console.log(`   Bloqueado después del éxito: ${isBlockedAfterSuccess ? '❌' : '✅'}`);

  // Test 3: Password Reset Rate Limiter
  console.log('\n2️⃣ Probando Password Reset Rate Limiter:');
  
  for (let i = 1; i <= 4; i++) {
    const isBlocked = passwordResetRateLimiter.isBlocked(testEmail);
    console.log(`   Solicitud ${i} - Bloqueado: ${isBlocked ? '🚫' : '✅'}`);
    
    if (!isBlocked) {
      passwordResetRateLimiter.recordAttempt(testEmail, false);
      const remaining = passwordResetRateLimiter.getRemainingAttempts(testEmail);
      console.log(`   Solicitudes restantes: ${remaining}`);
    } else {
      const blockedUntil = passwordResetRateLimiter.getBlockedUntil(testEmail);
      if (blockedUntil) {
        const minutes = Math.ceil((blockedUntil.getTime() - Date.now()) / (1000 * 60));
        console.log(`   Bloqueado por ${minutes} minutos`);
      }
      break;
    }
  }

  console.log('\n✨ Pruebas de Rate Limiter completadas');
}

testRateLimiter().catch(console.error);