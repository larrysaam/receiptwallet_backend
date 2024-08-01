const router = require("express").Router();
const Webhook = require('svix')
const User = require('../models/userModel')
    

 // Real code
 router.post('/', async(req, res)=>{
	console.log('api')
      try {
        const payloadString = req.body.toString();
        const svixHeaders = req.headers;

        const wh = new Webhook('whsec_QDnDv+teoIOXIbt0Kyq8mD+7dv6WwXR4');
        const evt = wh.verify(payloadString, svixHeaders);
        const { id, ...attributes } = evt.data;
        // Handle the webhooks
		console.log('attributes: ', attributes);
        const eventType = evt.type;
        if (eventType === 'user.created') {
			console.log(`User ${id} was ${eventType}`);
			console.log('attributes: ', attributes);

			const email = attributes.email;
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
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    }
  );

module.exports = router;