var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;

var path = require('path');
var appDir = path.dirname(require.main.filename);

app.get('/', function(req, res) {
    res.sendFile(appDir + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });


});

http.listen(port, function() {
    console.log('listening on *:' + port);
});