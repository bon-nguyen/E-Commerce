const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
const brandScheme = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Brand", brandScheme);
