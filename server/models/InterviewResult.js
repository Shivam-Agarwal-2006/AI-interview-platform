const mongoose = require("mongoose");

const interviewResultSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        role: String,

        company: String,

        averageScore: Number,

        totalQuestions: Number,

        completedAt: {
            type: Date,
            default: Date.now,
        },
    }
);

module.exports = mongoose.model(
    "InterviewResult",
    interviewResultSchema
);