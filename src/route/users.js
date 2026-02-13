const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('¡Funciona! Aquí estarán los usuarios.');
});

module.exports = router;