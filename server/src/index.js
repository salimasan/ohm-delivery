const shortid = require('shortid')
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
const Utils = require('./utils');
app.use(bodyParser.json())

function serve() {
    app.get('/ohms/:trackingId', async (req, res) => {
        const ohm = await Utils.getOhmByTrackingId(req.params.trackingId);
        res.send(ohm);
    })
	
	// For status updates from screen
	app.get('/ohms/submitDeliveryStatus/:newStatus/:trackingId/:refuseDetail', async (req, res) => {
	  await Utils.updateOhmStatusByTrackingId(req.params.newStatus, req.params.trackingId, req.params.refuseDetail);
      res.send();
    })

	// For regular status updates, this is not used yet
	app.get('/ohms/proceedDeliveryStatus/:trackingId', async (req, res) => {
	  let ohm = await Utils.getOhmByTrackingId(req.params.trackingId);
	  
	  switch(ohm.status) {
		case "CREATED":
			status = "PREPARING";
			break;
		case "PREPARING":
			status = "READY";
			break;
		case "READY":
			status  = "IN_DELIVERY";
			break;
		default:
		// Nothing to do return null, web tier could check null to understand operation is successfull
		res.send();
	  }
	  
	  ohm = await Utils.proceedOhmStatusByTrackingId(ohm);
      res.send(ohm);
    })

	app.get('/ohms/reOrderSameOhm/:trackingId', async (req, res) => {
        let oldOhm = await Utils.getOhmByTrackingId(req.params.trackingId);
		let maxId = await Utils.getMaxId();	
		let newOhm = {comment: oldOhm.comment, description:oldOhm.description, client: oldOhm.client};
		newOhm.trackingId = makeTrackingId(8);
		newOhm.id = (maxId + 1);
		newOhm.status = "CREATED";
		newOhm.history = [{
			state: "CREATED",
			at: new Date().yyyymmdd()
		}];
		await Utils.insertNewOhm(newOhm);
        res.send(newOhm); // Send new created object, because it can be useful for informing user
    })
	

	app.get('/ohms/addComment/:trackingId/:comment', async (req, res) => {
	  await Utils.addCommentByTrackingId(req.params.trackingId, req.params.comment);
      res.send();
    })

    app.listen(3000, () => console.log('listening on port 3000'));
}

function makeTrackingId(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};


serve();