# NexoFit Backend API

Sistema backend completo para la gestión de un gimnasio/centro fitness, incluyendo gestión de usuarios, clases, reservas y autenticación segura.

## 🚀 Características

- ✅ **Sistema de Autenticación Completo**
  - Registro e inicio de sesión
  - JWT con refresh tokens
  - Roles de usuario (cliente, instructor, admin)
  - Cambio de contraseña seguro
- ✅ **Gestión de Usuarios**
  - Perfiles de usuario
  - Información física (peso, altura)
  - Imágenes de perfil

- ✅ **Estructura Escalable**
  - Arquitectura en capas (MVC)
  - Separación de responsabilidades
  - Código modular y reutilizable

- ✅ **Seguridad**
  - Contraseñas hasheadas con bcrypt
  - Tokens JWT seguros
  - Validación robusta de entrada
  - Manejo centralizado de errores

## 📋 Requisitos Previos

- Node.js >= 14.x
- MySQL/MariaDB >= 10.x
- npm o yarn

Variables del archivo `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASS=tu_contraseña
DATABASE_NAME=mariadb

JWT_SECRET=tu_secreto_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secreto_super_seguro
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

NODE_ENV=development
PORT=8080
```

4. **Inicializar la base de datos**

```bash
# Si usas Docker
docker-compose up -d

# O ejecuta manualmente el script SQL
mysql -u root -p < db/init.sql
```

5. **Iniciar el servidor**

```bash
# Modo producción
npm start

# Modo desarrollo (con nodemon)
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📁 Estructura del Proyecto

```
NexoFit-Backend/
├── src/
│   ├── app.js                 # Punto de entrada de la aplicación
│   ├── config/
│   │   └── database.js        # Configuración de la base de datos
│   ├── controllers/           # Controladores (manejo de peticiones HTTP)
│   │   └── auth.controller.js
│   ├── services/              # Servicios (lógica de negocio)
│   │   └── auth.service.js
│   ├── middlewares/           # Middlewares personalizados
│   │   ├── auth.middleware.js
│   │   └── errorHandler.js
│   ├── validators/            # Validadores de entrada
│   │   └── auth.validator.js
│   ├── utils/                 # Utilidades
│   │   ├── jwt.js
│   │   └── encryption.js
│   └── routes/                # Definición de rutas
│       ├── index.js
│       └── auth.route.js
├── db/
│   └── init.sql               # Script de inicialización de BD
├── .env.example               # Plantilla de variables de entorno
├── package.json
├── docker-compose.yml
├── AUTH_DOCUMENTATION.md      # Documentación detallada de autenticación
├── USAGE_EXAMPLES.js          # Ejemplos de uso
└── README.md
```

## 🔐 API Endpoints

### Health Check

```http
GET /api/health
```

### Autenticación

| Método | Endpoint                       | Descripción                | Auth |
| ------ | ------------------------------ | -------------------------- | ---- |
| POST   | `/api/auth/register`           | Registrar nuevo usuario    | No   |
| POST   | `/api/auth/login`              | Iniciar sesión             | No   |
| POST   | `/api/auth/refresh`            | Refrescar token            | No   |
| GET    | `/api/auth/me`                 | Info del usuario actual    | Sí   |
| GET    | `/api/auth/profile`            | Perfil completo            | Sí   |
| PUT    | `/api/auth/profile`            | Actualizar perfil          | Sí   |
| POST   | `/api/auth/change-password`    | Cambiar contraseña         | Sí   |
| POST   | `/api/auth/logout`             | Cerrar sesión              | Sí   |
| POST   | `/api/auth/forgot-password`    | Recuperar contraseña       | No   |
| GET    | `/api/auth/check-email/:email` | Verificar email disponible | No   |

Para documentación detallada de cada endpoint, consulta [AUTH_DOCUMENTATION.md](AUTH_DOCUMENTATION.md)

## 🔑 Autenticación

El sistema usa JWT (JSON Web Tokens) para autenticación. Para acceder a rutas protegidas:

1. Obtén un token mediante login o registro
2. Incluye el token en el header `Authorization`:

```http
Authorization: Bearer <tu-access-token>
```

### Ejemplo con curl:

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nexofit.com","password":"123456"}'

# Usar el token
curl -X GET http://localhost:8080/api/auth/profile \
  -H "Authorization: Bearer <token-recibido>"
```

## 👥 Roles de Usuario

- **client**: Usuario normal (puede reservar clases)
- **instructor**: Instructor (puede ver sus clases asignadas)
- **admin**: Administrador (acceso completo)

## 🛡️ Seguridad

### Requisitos de Contraseña

- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial

### Tokens

- **Access Token**: Expira en 1 hora (configurable)
- **Refresh Token**: Expira en 7 días (configurable)

## 📚 Documentación Adicional

- [AUTH_DOCUMENTATION.md](AUTH_DOCUMENTATION.md) - Documentación completa del sistema de autenticación
- [USAGE_EXAMPLES.js](USAGE_EXAMPLES.js) - Ejemplos de uso y código de referencia

## 🧪 Testing

Para probar la API puedes usar:

- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (extensión de VS Code)
- [curl](https://curl.se/)

### Usuarios de prueba (después de ejecutar init.sql):

| Email              | Contraseña | Rol        |
| ------------------ | ---------- | ---------- |
| admin@nexofit.com  | 123456     | admin      |
| laura@nexofit.com  | 123456     | instructor |
| carlos@nexofit.com | 123456     | client     |
| ana@nexofit.com    | 123456     | client     |

⚠️ **Importante**: Cambia estas contraseñas en producción

## 🐳 Docker

Para ejecutar con Docker:

```bash
docker-compose up -d
```

Esto iniciará:

- Base de datos MariaDB en puerto 3306
- Adminer (UI para BD) en puerto 8081
