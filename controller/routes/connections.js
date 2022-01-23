const express = require('express');
const axios = require('axios');
const router = express.Router();

const AGENT_URL = (endpoint) => `http://localhost:8001/${endpoint}`;

router.post('/connections', function(req, res) {
  let rfc23State;
  if(req.body) rfc23State = req.body.rfc23_state;

  if(rfc23State === 'invitation-sent') {
    console.log(`Invitation created with connection ID ${req.body.connection_id}`);

  } else if(rfc23State === 'invitation-received') {
    console.log(`Invitation received from ${req.body.their_label} connection ID ${req.body.connection_id}`);

    axios.post(AGENT_URL(`connections/${req.body.connection_id}/accept-invitation`)).then(result => {
      console.log(`Invitation accepted`);
    }).catch(_ => console.log('Agent unavailable'));

  } else if(rfc23State === 'request-sent') {
    console.log(`Connection request sent to ${req.body.their_label} connection ID ${req.body.connection_id}`);

  } else if(rfc23State === 'request-received') {
    console.log(`Request received from ${req.body.their_label} connection ID ${req.body.connection_id}`); 

  } else if(rfc23State === 'response-sent') {
    console.log(`Connection response sent to ${req.body.their_label} connection ID ${req.body.connection_id}`); 

  } else if(rfc23State === 'response-received') {
    console.log(`Connection response received from ${req.body.their_label} connection ID ${req.body.connection_id}`);

  } else if(rfc23State === 'completed') {
    console.log(`Connection established with ${req.body.their_label} connection ID ${req.body.connection_id}`);

  } else {
    console.log(`Unknown RFC23 connection state ${req.body && req.body.connection_id ? 
    `from connection ID ${req.body.connection_id}` : ''}`);
  }
  res.status(200).send('Success');
});

module.exports = router;
