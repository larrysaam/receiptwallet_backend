const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./routes/user')
const auth = require('./middleware/auth')
const receiptRoute = require('./routes/receipt')
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const {Webhook} = require('svix')
const User = require('./models/userModel')
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
app.use('/user', userRoute)
app.use('/receipt', receiptRoute)

// Real code
app.post(
    '/api/webhooks',
    bodyParser.raw({ type: 'application/json' }),
    async function (req, res) {
    const headers = req.headers;
	const payload = req.body.text();
  
	let svix_id, svix_timestamp, svix_signature;
  
	try {
	  svix_id = headers["Svix-Id"][0];
	  svix_timestamp = headers["Svix-Timestamp"][0];
	  svix_signature = headers["Svix-Signature"][0];
  
	  if (!svix_id || !svix_timestamp || !svix_signature) {
		throw new Error();
	  }
	} catch (err) {
        console.log(err)
	  response.setStatusCode(400);
	  return response.setBody(
		JSON.stringify({
		  success: false,
		  message: "Error occured -- no svix headers",
		})
	  );
	}

	const wh = new Webhook('whsec_QDnDv+teoIOXIbt0Kyq8mD+7dv6WwXR4');

	let evt;


     try {
		evt = wh.verify(payload, {
			"svix-id": svix_id,
			"svix-timestamp": svix_timestamp,
			"svix-signature": svix_signature,
		  });

        const { id, ...attributes } = evt.data;
        // Handle the webhooks
		console.log('attributes: ', attributes);
        const eventType = evt.type;
		
        if (eventType === 'user.created') {
          console.log(`User ${id} was ${eventType}`);
          console.log(attributes);
          const email = attributes.email_addresses[0].email_address;
		    const phone = attributes.phoneNumbers
    	
			const user = new User({
				_id: new mongoose.Types.ObjectId(),
				email,
				country: '',
				plan: 'free',
				phone
			})
			console.log('User saved to database');
			await user.save()
		
        }
        res.status(200).json({
          success: true,
          message: 'Webhook received',
        });
      } catch (err) {
        console.log(err)
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    }
  );




//in case route is not available
app.use((req, res)=>{
    const error = new Error('page not found')
    error.message = 'page not found !'
    res.status(500).json({error : {msg: error.message}})
})

module.exports = app