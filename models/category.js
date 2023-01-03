const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type : String,
        unique : true,
        trim : true,
        maxlength : 32,
        required : true
    }    
}, { timestamps : true })


module.exports = mongoose.model('Category', categorySchema);