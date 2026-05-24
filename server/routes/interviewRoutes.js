const express = require("express");

const Interview = require("../models/Interview");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();


// GET all interviews
router.get("/", authMiddleware, async (req, res) => {

    try {

        const interviews = await Interview.find({
            user: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json(interviews);

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
        });
    }
});

module.exports = router;