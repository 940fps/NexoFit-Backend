const cors = require('cors');
const express = require('express');
const userRouter = require('./routers/userRouter');

const app = express();

app.use(cors());
app.use(express.json());

app.listen(8080, () => {
  console.log("Iniciando el backend en el puerto 8080");
});