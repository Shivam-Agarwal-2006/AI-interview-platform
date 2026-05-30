const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    saveInterview,
    getHistory,
} = require("../controllers/interviewResultController");

router.post(
    "/save",
    authMiddleware,
    saveInterview
);

router.get(
    "/history",
    authMiddleware,
    getHistory
);

module.exports = router;