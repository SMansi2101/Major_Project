    const mongoose = require('mongoose');

    const quizSchema = new mongoose.Schema({
        standard: Number,
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        questions: [
            {
                text: String,
                options: [String],
                correct: Number
            }
        ]
    });

    module.exports = mongoose.model('Quiz',quizSchema);
