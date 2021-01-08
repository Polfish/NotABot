const mongoose = require('mongoose');

module.exports = mongoose.model("Reaction", new mongoose.Schema({
    trigger: { type: String },
    reaction: { type: String },
    id: { type: Number },
    createdAt: { type: Number, default: Date.now() }
}));