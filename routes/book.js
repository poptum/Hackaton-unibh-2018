var express = require('express');
var router = express.Router();
var http = require('http');
var io = require('socket.io')(http);


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('Express RESTful API');
});

router.get('/ocorrencia', function (req, res, next) {
  io.emit('ocorrencia', { lat: req.lat, lng: req.lng });
  res.send('');
});

module.exports = router;

