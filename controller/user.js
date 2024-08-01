const mongoose = require('mongoose')
const User = require('../models/userModel')


//signup new user
exports.Signup = (req, res)=>{
    const {email, country, plan, phone} = req.body

    User.find({"email": email}).exec()
    .then(users=>{
        if(users.length >= 1){
            res.status(409).json({
                error:{
                    message: 'Mail exists'
                }
            })
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                country,
                plan,
                phone
            })
            user.save()
            .then(result=>{
                res.status(200).json({
                    message: 'signed up'
                })
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            error:{
                message: err
            }
        })
    })
}

// upgrade plan
exports.Upgrade = (req, res)=>{
    const _id = req.params._id
    const {email, country, plan} = req.body

    User.findByIdAndUpdate({_id}, {$push : {country, plan}}).exec()
    .then(result=>{
        res.status(200).json({
            message: 'upgraded'
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:{
                message: err
            }
        })
    })
}

