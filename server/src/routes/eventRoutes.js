const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createEvent,
  getAllEvents,
  getEventsByProjectId,
  generateEventQr,
  getEventAttendance,
  recordAttendance,
} = require("../models/eventModel");

const router = express.Router();

router.post("/scan", authMiddleware, async (req, res) => {
  const { qrCode } = req.body;
  const userId = req.user.id;

  if (!qrCode) {
    return res.status(400).json({ message: "QR Code is required" });
  }

  try {
    const attendance = await recordAttendance({ userId, qrCode });
    console.log("Attendance success for", userId, qrCode);
    return res.status(200).json({ message: "Prezență salvată", attendance });
  } catch (error) {
    console.error("Scan error:", error);
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await getAllEvents();
    return res.json({ events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

router.get("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const events = await getEventsByProjectId(projectId);
    return res.json({ events });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { projectId, name, date, location, qrCode } = req.body;
  if (!projectId || !name || !date || !location) {
    return res
      .status(400)
      .json({ message: "projectId, name, date, location are required" });
  }
  try {
    const event = await createEvent({
      projectId,
      name,
      date,
      location,
      qrCode,
    });
    return res.status(201).json({ event });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
});

router.patch("/:id/generate-qr", authMiddleware, async (req, res) => {
  try {
    console.log("Generating QR for event:", req.params.id);
    const eventId = req.params.id;
    const event = await generateEventQr(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.json({ event });
  } catch (error) {
    console.error("Error generating QR:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate QR code", error: error.message });
  }
});

router.get("/:id/attendance", authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.id;
    const attendance = await getEventAttendance(eventId);
    return res.json({ attendance });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch attendance", error: error.message });
  }
});

module.exports = router;
