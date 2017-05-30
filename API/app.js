const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 8080;
var path = require('path');
var appDir = path.dirname(require.main.filename);

app.use("/js", express.static(appDir + "/js"))
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

    socket.on('log', function(message) {
        console.log(message);
        io.emit('log', message);
    })
});


http.listen(port, function() {
    console.log('listening on *:' + port);
});