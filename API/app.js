var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;
var path = require('path');
var appDir = path.dirname(require.main.filename);



app.get('/', function(req, res) {
    res.sendFile(appDir + '/index.html');
});
var count = 0;
io.on('connection', function(socket) {

    socket.on('ABC', function(msg) {
        console.log("user emited")
        count += 1;
        io.emit('chat message', 'I get chat message ' + count);
    });
});


http.listen(port, function() {
    console.log('listening on *:' + port);
});