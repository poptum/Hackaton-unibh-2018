var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var apiRouter = require('./routes/book');
var app = express();
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {

    socket.on('disconnect', function () {
        io.emit('users-changed', { user: socket.nickname, event: 'left' });
    });

    socket.on('localizacao', (req) => {
        io.emit('atualizaLoc', { id: req.id, lat: req.lat, lng: req.lng, ocorrencia: req.ocorrencia });
    });

    socket.on('add-message', (message) => {
        io.emit('message', { id: req.id, text: message.text, from: socket.nickname, created: new Date() });
    });
});

server.listen(3000);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/mean-angular6')));
app.get('/ocorrencia', function (req, res, next) {
    io.emit('ocorrencia', { lat: '-19.87882', lng: '-43.923042' });
});
app.use('/', express.static(path.join(__dirname, 'dist/mean-angular6')));
app.use('/api', apiRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.status);
});

module.exports = app;