const jwt = require("jsonwebtoken");

// Configuración de JWT (en producción, usar variables de entorno)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

/**
 * Genera un token de acceso JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} Token JWT
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "nexofit-api",
    audience: "nexofit-client",
  });
};

/**
 * Genera un token de refresco JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} Refresh token JWT
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: "nexofit-api",
    audience: "nexofit-client",
  });
};

/**
 * Genera ambos tokens (access y refresh)
 * @param {Object} user - Datos del usuario
 * @returns {Object} Objeto con accessToken y refreshToken
 */
const generateTokens = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Verifica un token de acceso
 * @param {string} token - Token a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o expirado
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "nexofit-api",
      audience: "nexofit-client",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    }
    throw error;
  }
};

/**
 * Verifica un token de refresco
 * @param {string} token - Refresh token a verificar
 * @returns {Object} Payload decodificado
 * @throws {Error} Si el token es inválido o expirado
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "nexofit-api",
      audience: "nexofit-client",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Refresh token inválido");
    }
    throw error;
  }
};

/**
 * Decodifica un token sin verificar (útil para debugging)
 * @param {string} token - Token a decodificar
 * @returns {Object} Payload decodificado
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
};
