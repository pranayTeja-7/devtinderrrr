const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    age: {
        type: Number,
    },
    emailID: {
        type: String,
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    }  

})

const User = mongoose.model("user", userSchema);

module.exports = {User};