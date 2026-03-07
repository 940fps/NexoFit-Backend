const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const bookingRoutes = require("./booking.route");
const modalityRoutes = require("./modality.route");
const classRoutes = require("./class.route");
const categoryRoutes = require("./category.route");

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "NexoFit API está funcionando",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/bookings", bookingRoutes);
router.use("/modalities", modalityRoutes);
router.use("/classes", classRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
