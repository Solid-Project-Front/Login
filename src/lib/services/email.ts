import nodemailer from 'nodemailer';

// Configuración del transportador de email
const createTransporter = () => {
  // Verificar que las variables de entorno estén configuradas
  const emailHost = process.env.EMAIL_HOST;
  const emailPort = process.env.EMAIL_PORT;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailHost || !emailPort || !emailUser || !emailPass) {
    console.warn('Email configuration not found. Emails will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host: emailHost,
    port: parseInt(emailPort),
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: emailUser,
      pass: emailPass,
    },
    tls: {
      rejectUnauthorized: false // Para desarrollo local
    }
  });
};

// Plantilla de email para recuperación de contraseña
const getPasswordResetEmailTemplate = (username: string, resetUrl: string) => {
  return {
    subject: 'Recuperación de Contraseña - Red Coop Central',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #0088cc, #00a8ff);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(45deg, #0088cc, #00a8ff);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Red Coop Central</h1>
          <p>Recuperación de Contraseña</p>
        </div>
        
        <div class="content">
          <h2>Hola ${username},</h2>
          
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Red Coop Central.</p>
          
          <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
              <li>Este enlace es válido por <strong>1 hora</strong></li>
              <li>Si no solicitaste este cambio, puedes ignorar este email</li>
              <li>Tu contraseña actual seguirá siendo válida hasta que la cambies</li>
            </ul>
          </div>
          
          <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">
            ${resetUrl}
          </p>
          
          <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
          
          <p>Saludos,<br>
          <strong>El equipo de Red Coop Central</strong></p>
        </div>
        
        <div class="footer">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          <p>© 2024 Red Coop Central. Todos los derechos reservados.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Hola ${username},

Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Red Coop Central.

Para restablecer tu contraseña, visita el siguiente enlace:
${resetUrl}

IMPORTANTE:
- Este enlace es válido por 1 hora
- Si no solicitaste este cambio, puedes ignorar este email
- Tu contraseña actual seguirá siendo válida hasta que la cambies

Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.

Saludos,
El equipo de Red Coop Central

---
Este es un email automático, por favor no respondas a este mensaje.
© 2024 Red Coop Central. Todos los derechos reservados.
    `
  };
};

// Función principal para enviar email de recuperación de contraseña
export async function sendPasswordResetEmail(email: string, username: string, token: string): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    // Si no hay configuración de email, solo loguear (modo desarrollo)
    if (!transporter) {
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const resetUrl = `${appUrl}/reset-password?token=${token}`;
      
      console.log('\n=== EMAIL DE RECUPERACIÓN DE CONTRASEÑA ===');
      console.log(`Para: ${email}`);
      console.log(`Usuario: ${username}`);
      console.log(`Token: ${token}`);
      console.log(`URL de recuperación: ${resetUrl}`);
      console.log('==========================================\n');
      
      return true;
    }

    // Construir URL de recuperación
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    
    // Obtener plantilla de email
    const emailTemplate = getPasswordResetEmailTemplate(username, resetUrl);
    
    // Configurar opciones del email
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Red Coop Central <noreply@redcoopcentral.com>',
      to: email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email de recuperación enviado:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return false;
  }
}

// Función para verificar la configuración de email
export function isEmailConfigured(): boolean {
  return !!(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
}

// Función para probar la configuración de email
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email no configurado - funcionando en modo desarrollo');
      return true;
    }

    await transporter.verify();
    console.log('Configuración de email verificada correctamente');
    return true;
    
  } catch (error) {
    console.error('Error en la configuración de email:', error);
    return false;
  }
}