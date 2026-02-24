const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const bookingRoutes = require('./booking.route');

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "NexoFit API está funcionando",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;