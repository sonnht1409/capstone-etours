const app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http);
var port = 8080;

var path = require('path');
var appDir = path.dirname(require.main.filename);

const sql = require('mssql');

const connection = new sql.ConnectionPool({
    user: 'etours',
    password: "$Son01627335534",
    server: "etours.database.windows.net",
    driver: 'tedious',
    database: 'etours',
    options: {
        encrypt: true
    }


})

connection.connect(err => {
    if (err) {
        console.log("have error");
        console.log(err)
    } else {
        console.log("connect successfully")
    }
})

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