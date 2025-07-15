# 📧 Configuración del Sistema de Email

Este documento explica cómo configurar el sistema de envío de emails para la recuperación de contraseñas.

## 🚀 Configuración Rápida

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración básica
SESSION_SECRET=tu_secreto_muy_largo_y_seguro_aqui_123

# Configuración de Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
EMAIL_FROM=Red Coop Central <noreply@redcoopcentral.com>

# URL base de la aplicación
APP_URL=http://localhost:3000
```

### 2. Configuración para Gmail

Para usar Gmail como proveedor de email:

1. **Habilita la verificación en 2 pasos** en tu cuenta de Google
2. **Genera una contraseña de aplicación**:
   - Ve a [Google Account Settings](https://myaccount.google.com/apppasswords)
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "Red Coop Central" como nombre
   - Usa la contraseña generada en `EMAIL_PASS`

### 3. Otros Proveedores de Email

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu_email@outlook.com
EMAIL_PASS=tu_contraseña
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=tu_email@yahoo.com
EMAIL_PASS=tu_contraseña_de_aplicacion
```

#### Servidor SMTP Personalizado
```env
EMAIL_HOST=tu_servidor_smtp.com
EMAIL_PORT=587
EMAIL_USER=tu_usuario
EMAIL_PASS=tu_contraseña
```

## 🧪 Probar la Configuración

### Verificar Configuración
```bash
npm run test-email
```

### Enviar Email de Prueba
```bash
npm run test-email tu_email@ejemplo.com
```

## 🔧 Modo Desarrollo

Si no configuras las variables de email, el sistema funcionará en **modo desarrollo**:

- ✅ No se envían emails reales
- 📝 Los enlaces de recuperación se muestran en la consola del servidor
- 🔗 Puedes copiar el enlace directamente para probar

**Ejemplo de salida en consola:**
```
=== EMAIL DE RECUPERACIÓN DE CONTRASEÑA ===
Para: usuario@ejemplo.com
Usuario: juan_perez
Token: abc123def456ghi789
URL de recuperación: http://localhost:3000/reset-password?token=abc123def456ghi789
==========================================
```

## 🎨 Personalización del Email

El email de recuperación incluye:

- 🎨 **Diseño profesional** con colores de la marca
- 📱 **Responsive** para móviles y escritorio
- ⚠️ **Advertencias de seguridad** claras
- 🔗 **Botón de acción** prominente
- 📝 **Versión de texto plano** como respaldo

### Modificar la Plantilla

Edita el archivo `src/lib/services/email.ts` en la función `getPasswordResetEmailTemplate()` para personalizar:

- Colores y estilos
- Texto del mensaje
- Logo de la empresa
- Información de contacto

## 🔒 Seguridad

### Mejores Prácticas Implementadas

- ✅ **Tokens únicos** de 32 caracteres
- ⏰ **Expiración** de 1 hora
- 🔐 **No revelación** de existencia de emails
- 🧹 **Limpieza automática** de tokens expirados
- 📧 **Validación** de formato de email

### Variables de Entorno Seguras

- ❌ **Nunca** commits las variables de entorno
- 🔑 Usa **contraseñas de aplicación** en lugar de contraseñas principales
- 🔄 **Rota** las credenciales regularmente

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica que `EMAIL_USER` y `EMAIL_PASS` sean correctos
- Para Gmail, asegúrate de usar una contraseña de aplicación

### Error: "Connection timeout"
- Verifica `EMAIL_HOST` y `EMAIL_PORT`
- Comprueba tu conexión a internet
- Algunos ISPs bloquean el puerto 587

### Error: "Authentication failed"
- Verifica las credenciales
- Para Gmail, habilita "Acceso de aplicaciones menos seguras" o usa contraseñas de aplicación

### Los emails van a spam
- Configura `EMAIL_FROM` con un dominio válido
- Considera usar un servicio como SendGrid o Mailgun para producción

## 🚀 Producción

Para producción, considera usar servicios especializados:

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=tu_api_key_de_sendgrid
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=tu_usuario_mailgun
EMAIL_PASS=tu_contraseña_mailgun
```

### Amazon SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=tu_access_key
EMAIL_PASS=tu_secret_key
```

## 📊 Monitoreo

El sistema registra automáticamente:

- ✅ Emails enviados exitosamente
- ❌ Errores de envío
- 🔗 URLs de recuperación generadas
- ⏰ Tokens expirados

Revisa los logs del servidor para monitorear el funcionamiento.

## 🆘 Soporte

Si tienes problemas:

1. Ejecuta `npm run test-email` para diagnosticar
2. Revisa los logs del servidor
3. Verifica las variables de entorno
4. Consulta la documentación de tu proveedor de email

---

¡Listo! Tu sistema de recuperación de contraseñas está configurado y funcionando. 🎉