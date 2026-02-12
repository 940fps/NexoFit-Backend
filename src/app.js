require('dotenv').config({ path: '.example.env' });
const cors = require('cors');
const express = require('express');
const userRouter = require('./route/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);

app.listen(8080, () => {
  console.log("Iniciando el backend en el puerto 8080");
});