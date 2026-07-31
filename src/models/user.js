const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        maxLength: 40,

    },
    lastName: {
        type: String,
        trim: true,
        maxLength: 40,

    },
    age: {
        type: Number,
        min: 18,
    },
    emailID: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,
        unique: true,
        validate: function(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email ID");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("password is weak");
            }
        }
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    }
    


})

const User = mongoose.model("user", userSchema);

module.exports = {User};