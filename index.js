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
        io.on('connection', function(socket) {
            io.emit('chat message', 'database connected');
        })

    }
})

app.get('/', function(req, res) {
    res.sendFile(appDir + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    socket.on('getTouristList', function(params) {
        console.log("get tourist list params: ")
        console.log(params)
        var tourInstanceID = params.tourInstanceID;
        var coachID = params.coachID;
        var getTouristListQuery = 'select [user].id as UserID,UI.Fullname, UCSN.SeatNumber, TSTT.Status \n ' +
            'from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n ' +
            'inner join UserInfo as UI on [user].UserInfoID = UI.id \n ' +
            'inner join TouristStatus as TSTT on [user].TouristStatus = TSTT.ID \n' +
            'where [user].RoleID = 3 and [user].TourInstanceID = ' + tourInstanceID +
            ' and UCSN.CoachID= ' + coachID + ' and [user].isActive = 1';
        console.log(getTouristListQuery);
        connection.request().query(getTouristListQuery, function(err, result) {
            var message = "";
            var touristList = [];
            if (err) {
                message = "ERROR! " + getTouristListQuery;
            } else {
                message = "SUCCESS! " + getTouristListQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    touristList = result.recordset;
                    console.log(touristList);
                }
            }
            io.emit('chat message', message);
            io.emit('getTouristList', {
                touristList: touristList
            })
        })
    });

    socket.on('Scan', function(params) {
        var cardCode = params.cardCode;
        console.log("code: " + cardCode)
        var tourInstanceID = params.tourInstanceID;
        var getUserQuery = "select tourInstanceID, UserID from Card where Code='" + cardCode + "'";
        console.log(getUserQuery);
        var UserInfo = {};
        connection.request().query(getUserQuery, function(err, result) {
            var message = "";
            var status = "FAILED";
            if (err) {
                message = "ERROR! " + getUserQuery;
            } else {
                message = "SUCCESS! " + getUserQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    console.log(result)
                    if (tourInstanceID == result.recordset[0].tourInstanceID) {
                        status = "SUCCESS";
                        var UserID = result.recordset[0].UserID
                        var getTouristMessage = "";

                        // get tourist status to response
                        var getTouristInfoQuery = "select fullname, [user].id as UserID, SeatNumber, TouristStatus \n " +
                            "from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n " +
                            "inner join UserInfo as UI on [user].UserInfoID = UI.id \n " +
                            "where [user].id = " + UserID;
                        connection.request().query(getTouristInfoQuery, function(err, result) {
                            if (err) {
                                getTouristMessage = "ERROR! " + getTouristInfoQuery;
                            } else {
                                getTouristMessage = "SUCCESS! " + getTouristInfoQuery;
                                if (typeof result !== "undefined" && result.recordset.length > 0) {
                                    UserInfo = result.recordset[0];
                                }
                            }

                            io.emit('chat message', getTouristMessage);
                            io.emit('Scan', {
                                status: status,
                                fullname: UserInfo.fullname,
                                UserID: UserInfo.UserID,
                                SeatNumber: UserInfo.SeatNumber,
                                TouristStatus: UserInfo.TouristStatus
                            })
                        })

                        // update tourist status 

                        var updateTouristStatusQuery = "if (select TouristStatus from [user] where id =" + UserID + ") != 1 \n" +
                            "update [user] set TouristStatus = 1 where id =" + UserID + " \n " +
                            "else \n" +
                            "update [user] set TouristStatus = 2 where id =" + UserID;
                        var updateMessage = "";
                        connection.request().query(updateTouristStatusQuery, function(err, result) {
                            if (err) {
                                updateMessage = "ERROR! " + updateTouristStatusQuery;
                            } else {
                                updateMessage = "SUCCESS! " + updateTouristStatusQuery;
                            }
                            io.emit('chat message', updateMessage);
                        })


                    }
                }
            }
            io.emit('chat message', message)

        })
    });

});

http.listen(port, function() {
    console.log('listening on *:' + port);
});