const shortid = require('shortid')
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
const Utils = require('./utils');
app.use(bodyParser.json())

function serve() {
    app.get('/ohms/:id', async (req, res) => {
        const ohm = await Utils.getOhmById(req.params.id);
        res.send(ohm);
    })
	
	 app.get('/ohms/submitDeliveryStatus/:newStatus/:id/:refuseDetail', async (req, res) => {
 
	  await Utils.updateOhmStatusById(req.params.id,req.params.newStatus, req.params.refuseDetail);
      res.send();
	  //res.send(ohm);
	  
	   //console.log(req.params.id); 
	   //console.log(req.params.newStatus); 
    })

    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();