const mongoose = require("mongoose");

const courseDetailsSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    standard: { type: Number, required: true },
    prerequisites: [{ name: String }],
    resources: [{ title: String, link: String }],
});

module.exports = mongoose.model("CourseDetails", courseDetailsSchema);
