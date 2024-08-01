const router = require("express").Router();
const Webhook = require('svix')
const User = require('../models/userModel')
    

 // Real code
 router.post('/', async(req, res)=>{
	cons
      try {
        const payloadString = req.body.toString();
        const svixHeaders = req.headers;

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(payloadString, svixHeaders);
        const { id, ...attributes } = evt.data;
        // Handle the webhooks
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