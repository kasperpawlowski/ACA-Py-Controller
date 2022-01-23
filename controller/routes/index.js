var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'ACA-Py Controller' });
});

router.post('/', function(req, res) {
  res.render('index', { title: 'ACA-Py Controller' });
});

module.exports = router;