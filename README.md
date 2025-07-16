# Red Coop Central - Sistema de Autenticación

Sistema de autenticación completo construido con SolidJS y SolidStart, diseñado para conectar y fortalecer cooperativas.

## Características

- ✅ **Autenticación completa**: Login, registro y recuperación de contraseña
- ✅ **Validación en tiempo real**: Feedback inmediato en formularios
- ✅ **Protección contra ataques**: Rate limiting y validaciones robustas
- ✅ **Base de datos SQLite**: Con Drizzle ORM para desarrollo
- ✅ **Sistema de emails**: Recuperación de contraseña por email
- ✅ **Interfaz moderna**: Diseño responsive y accesible

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar base de datos
npm run db:push

# Configurar variables de entorno (opcional)
cp .env.template .env
# Editar .env con tu configuración de email
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar servidor de producción

# Base de datos
npm run db:generate  # Generar migraciones
npm run db:push      # Aplicar cambios a la base de datos
npm run db:studio    # Abrir Drizzle Studio

# Utilidades
npm run test-email   # Probar configuración de email
npm run hash-passwords # Actualizar contraseñas existentes
```

## Configuración de Email

Para habilitar el envío de emails de recuperación de contraseña:

1. Copia `.env.template` a `.env`
2. Configura las variables de email:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_password_de_aplicacion
EMAIL_FROM=Red Coop Central <noreply@redcoopcentral.com>
APP_URL=http://localhost:3000
```

Para Gmail, necesitas usar una "Contraseña de aplicación": https://myaccount.google.com/apppasswords

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── lib/
│   ├── db/             # Configuración de base de datos
│   ├── hooks/          # Hooks personalizados
│   ├── middleware/     # Middleware de autenticación
│   ├── services/       # Servicios (email, etc.)
│   └── utils/          # Utilidades y validaciones
└── routes/             # Páginas de la aplicación
```

## Seguridad

- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación robusta**: Validación en cliente y servidor
- **Hash de contraseñas**: Usando bcryptjs
- **Sesiones seguras**: Con cookies firmadas
- **Tokens de recuperación**: Con expiración automática

## Tecnologías

- **Frontend**: SolidJS, SolidStart
- **Base de datos**: SQLite con Drizzle ORM
- **Autenticación**: Sesiones con cookies
- **Email**: Nodemailer
- **Validación**: Validaciones personalizadas
- **Estilos**: CSS personalizado

## Licencia

Este proyecto está bajo la Licencia MIT.
