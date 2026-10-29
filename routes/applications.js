
const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// Submit a new internship application
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      rollNumber,
      internshipId,
      internshipTitle,
      company
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !rollNumber?.trim() ||
      !internshipId ||
      !internshipTitle
    ) {
      return res.status(400).json({
        message: "Please provide all required application details."
      });
    }

    const application = await Application.create({
      name: name.trim(),
      email: email.trim(),
      rollNumber: rollNumber.trim(),
      internshipId,
      internshipTitle,
      company: company || ""
    });

    res.status(201).json({
      message: "Application submitted successfully!",
      application
    });
  } catch (error) {
    console.error("Application submission error:", error);
    res.status(500).json({
      message: "Failed to submit application."
    });
  }
});

// Retrieve all applications
router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Fetching applications error:", error);
    res.status(500).json({
      message: "Failed to retrieve applications."
    });
  }
});

module.exports = router;
