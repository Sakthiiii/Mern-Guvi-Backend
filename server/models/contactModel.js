const mongoose = require ("mongoose");

const contactSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required:true,
    },
    lastname:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
    },
    company:{
        type: String,
        required:true,
    },
    phone :{
        type: Number,
        required:true,
    },
    create_date :{
        type:Date,
        default :Date.now,
    }
})

module.exports = Contact =mongoose.model("Contact",contactSchema);