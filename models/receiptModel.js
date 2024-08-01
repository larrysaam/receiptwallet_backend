const mongoose = require('mongoose')

const receiptModel = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid:{
        type: String , 
        require: true,
    },
    category: {
        type: String , 
        require: true,
    },
    description: {
        type: String , 
        require: true,
    },
    total: {
        type: String , 
        require: true,
    },
    transid: {
        type: String , 
        require: true,
    },
    issuedate: {
        type: String , 
        require: true,
    },
    saveddate: {
        type: String , 
        require: true,
    },
    type: {
        type: String , 
        require: true,
    },
    currency: {
        type: String , 
        require: true,
    },
    imageurl: {
        type: String , 
        require: true,
    }
    
})

module.exports = mongoose.model('Receipt', receiptModel)