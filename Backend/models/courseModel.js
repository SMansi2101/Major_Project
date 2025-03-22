const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    prerequisites: [
        {
          name: String,
          standard: Number,
        }
      ],
    image: {
        type: String,
        required: true
    },
    resources: [
        {
            title: String,
            link: String,
        }
    ],
});

module.exports = mongoose.model('Course', courseSchema);

