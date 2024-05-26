const mongoose = require("mongoose");
const stuffs = require("stuffs");

const customerSchema = new mongoose.Schema({

    Password: { type: String, default: stuffs.randomString(12) },
    TwoFactor: { 
        active: { type: Boolean, default: false },
        secret: { type: String, default: null },
    },
    Auth: { type: String, required: true },
    IP: { type: String, required: true },
    Notification: {
        UserIDS: { type: Array, default: [] }
    },
    sorgular: { type: Array, default: [] },

});

module.exports = mongoose.model("whitelist", customerSchema);
