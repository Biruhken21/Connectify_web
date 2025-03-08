const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    role: {
        type: String,
        enum: ["startup", "developer", "investor"], 
        required: true, 
    },
    // startup specific fields
    
    startupName: { type: String, default: null },
    industry: { type: String, default: null },
    fundingNeeded: { type: Number, default: null },

    // developer specific fields
    techStack: { type: String, default: null },
    experience: { type: Number, default: null },
    github: { type: String, default: null },

    // investor specific fields

    companyName: { type: String, default: null },
    investmentSize: { type: Number, default: null },
    preferredIndustries: { type: String, default: null },



    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    },
    followings: {
        type: [String],
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    desc: {
        type: String,
        max:50
    },
    city: {
        type: String,
        max:50
    },
    from: {
        type: String,
        max:50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3],
    }

},
{timestamps:true}
);

module.exports = mongoose.model("User", UserSchema);