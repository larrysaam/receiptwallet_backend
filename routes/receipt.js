const express = require('express')
const Receipt = require('../models/receiptModel')
const ReceiptController = require('../controller/receipt')
const mongoose = require('mongoose')
const multer = require('multer')
const router = express.Router()


//storing image file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')      //you tell where to upload the files,
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

//image filter, accepts only jpeg and png
const fileFilter = (req, file, cb)=>{
    if(file.minetype === 'image/jpeg' || file.minetype === 'image/png' || file.minetype === 'image/jpg'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({storage: storage, limits:{
    fileSize: 1024 * 1024 * 5
}
})


//insert receipt
router.post('/', upload.single('imageurl'), ReceiptController.postReceipt)


//get all receipts
router.get('/:userid', ReceiptController.getReceipt)


//edit receipt
router.patch('/:_id', ReceiptController.EditReceipt)


//delet receipt
router.delete('/:_id', ReceiptController.removeReceipt)

module.exports = router