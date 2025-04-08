const mongoose = require("mongoose");

const courseDetailsSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    standard: { type: Number, required: true },
    prerequisites: [
        {
            title: String, // ✅ Title for the prerequisites section
            subPrerequisites: [{ name: String }] // ✅ List of sub-prerequisites under the title
        }
    ],
    resources: [{ title: String, link: String }],
});

module.exports = mongoose.model("CourseDetails", courseDetailsSchema);
