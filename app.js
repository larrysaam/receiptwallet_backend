const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/user')
const auth = require('./middleware/auth')
const receiptRoute = require('./routes/receipt')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const app = express()




//connecting to mongodb atlas database (Cloud)
mongoose.connect('mongodb+srv://Larrien:qwerty123456@cluster0.u7xnpo6.mongodb.net/ReceiptWallet?retryWrites=true&w=majority')

//middlewares
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

//Middleware
app.use(
    cookieSession({
        name:'session',
        keys:['cyberwolve'],
        maxAge:24*60*60*2
    })
)


//avoid cors errors
app.use(cors())



// routes
app.use('/api/webhooks', auth)
app.use('/user', userRoute)
app.use('/receipt', receiptRoute)



//in case route is not available
app.use((req, res)=>{
    const error = new Error('page not found')
    error.message = 'page not found !'
    res.status(500).json({error : {msg: error.message}})
})

module.exports = app