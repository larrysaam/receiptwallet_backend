const Receipt = require('../models/receiptModel')
const mongoose = require('mongoose')


//delete receipt
exports.removeReceipt =(req, res)=>{
    const _id = req.params._id

    Receipt.remove({_id}).exec()
    .then(result=>{
        res.status(200).json({
            message: 'deleted'
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: err
        })
    })
}


//save new receipt
exports.postReceipt = (req, res)=>{
    const { userid, category, description, total, transid, issuedate, saveddate, type, currency, imageurl} = req.body

    const receipt = new Receipt({
        _id: new mongoose.Types.ObjectId(),
        userid,
        category,
        description,
        total,
        transid,
        issuedate,
        saveddate,
        type,
        currency,
        imageurl: req.file.path
    })
    receipt.save()
    .then(result=>{
        res.status(200).json({
            message: 'saved',
            data: receipt
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: err
        })
    })

}


//edit receipt
exports.EditReceipt = (req, res)=>{
    const _id = req.params._id
    const {category, description, total, transid, issuedate, saveddate, type, currency} = req.body

    Receipt.findByIdAndUpdate({_id}, {$push: req.body})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'edited'
        })
    })
    .catch(err=>{
        res.status(500).json({
            message: err
        })
    })
}

//get all receipts
exports.getReceipt = (req, res)=>{
    const userid = req.params.userid

    Receipt.find({userid})
    .exec()
    .then(receipts=>{
        if(receipts.length<=0){
            res.status(404).json({
                data: []
            })
        }
        else{
            res.status(404).json({
                data: receipts.map(receipt=>{
                    return{
                        _id: receipt._id,
                        userid: receipt.userid,
                        category: receipt.category,
                        description: receipt.description,
                        total: receipt.total,
                        transid: receipt.transid,
                        issuedate: receipt.issuedate,
                        saveddate: receipt.saveddate,
                        type: receipt.type,
                        currency: receipt.currency,
                        imageurl: receipt.imageurl
                    }
                })  
            })
        }
    })
}