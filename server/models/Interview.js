const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    resumeName: {
        type: String,
    },

    analysis: {
        questions: [String],
        strengths: [String],
        weaknesses: [String],
        roles: [String],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model(
    "Interview",
    interviewSchema
);