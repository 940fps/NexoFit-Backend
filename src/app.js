const cors = require('cors');
const express = require('express');
const routes = require('./src/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);


// api routes
app.use('/api', routes);














app.listen(8080, () => {
  console.log("Iniciando el backend en el puerto 8080");
});