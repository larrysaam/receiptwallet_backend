const router = require("express").Router();
const Webhook = require('svix')
const User = require('../models/userModel')
    

 // Real code
 router.post('/', async(req, res)=>{
	console.log('api')
	const headers = request.headers;
	const payload = request.body.text();
  
	let svix_id, svix_timestamp, svix_signature;
  
	try {
	  svix_id = headers["Svix-Id"][0];
	  svix_timestamp = headers["Svix-Timestamp"][0];
	  svix_signature = headers["Svix-Signature"][0];
  
	  if (!svix_id || !svix_timestamp || !svix_signature) {
		throw new Error();
	  }
	} catch (err) {
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
	} catch (err) {
	  console.log("Webhook failed to verify. Error:", err.message);
  
	  response.setStatusCode(400);
	  return response.setBody(
		JSON.stringify({
		  success: false,
		  message: err.message,
		})
	  );
	}

	
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
		console.log(err)
        res.status(400).json({
          success: false,
          message: err.message,
        });
      }
    }
  );

module.exports = router;