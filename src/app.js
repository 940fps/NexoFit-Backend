const cors = require("cors");
const express = require("express");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");
// Importamos las rutas de clase

const app = express();

console.log(process.env.DATABASE_PASS);

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Manejar rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(8080, () => {
  console.log("Iniciando el backend en el puerto 8080");
});
