import 'dotenv/config';
import { testEmailConfiguration, sendPasswordResetEmail, isEmailConfigured } from '../src/lib/services/email';

async function testEmail() {
  console.log('🧪 Probando configuración de email...\n');
  
  // Verificar si el email está configurado
  const configured = isEmailConfigured();
  console.log(`📧 Email configurado: ${configured ? '✅ Sí' : '❌ No'}`);
  
  if (!configured) {
    console.log('\n📝 Para configurar el email, crea un archivo .env con:');
    console.log('EMAIL_HOST=smtp.gmail.com');
    console.log('EMAIL_PORT=587');
    console.log('EMAIL_USER=tu_email@gmail.com');
    console.log('EMAIL_PASS=tu_password_de_aplicacion');
    console.log('EMAIL_FROM=Red Coop Central <noreply@redcoopcentral.com>');
    console.log('APP_URL=http://localhost:3000');
    console.log('\n💡 Para Gmail, necesitas usar una "Contraseña de aplicación" en lugar de tu contraseña normal.');
    console.log('   Ve a: https://myaccount.google.com/apppasswords');
  }
  
  // Probar la configuración
  console.log('\n🔧 Probando conexión...');
  const connectionTest = await testEmailConfiguration();
  console.log(`🔗 Conexión: ${connectionTest ? '✅ Exitosa' : '❌ Falló'}`);
  
  // Probar envío de email de prueba
  if (process.argv[2]) {
    const testEmail = process.argv[2];
    console.log(`\n📤 Enviando email de prueba a: ${testEmail}`);
    
    const emailSent = await sendPasswordResetEmail(
      testEmail, 
      'Usuario de Prueba', 
      'TEST_TOKEN_123456789'
    );
    
    console.log(`📧 Email enviado: ${emailSent ? '✅ Exitoso' : '❌ Falló'}`);
  } else {
    console.log('\n💡 Para probar el envío de email, ejecuta:');
    console.log('npm run test-email tu_email@ejemplo.com');
  }
  
  console.log('\n✨ Prueba completada');
}

testEmail().catch(console.error);