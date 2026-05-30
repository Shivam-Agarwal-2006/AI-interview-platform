const InterviewResult = require("../models/InterviewResult");

exports.saveInterview = async (req, res) => {

    try {

        const result =
            await InterviewResult.create({

                user: req.user.id,

                role: req.body.role,

                company: req.body.company,

                averageScore:
                    req.body.averageScore,

                totalQuestions:
                    req.body.totalQuestions,
            });

        res.status(201).json(result);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getHistory = async (req, res) => {

    try {

        const history =
            await InterviewResult.find({

                user: req.user.id,
            })
                .sort({ completedAt: -1 });

        res.json(history);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};