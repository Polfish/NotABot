const mongoose = require('mongoose');

module.exports = mongoose.model("User", new mongoose.Schema ({
    name: { type: String },
    type: { type: String },
    id: { type: String },
    registeredAt: { type: Number, default: Date.now() }
}));