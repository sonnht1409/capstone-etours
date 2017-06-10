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
        io.on('connection', (socket) => {
            io.emit('chat message', 'database connected');
        })

    }
})

app.get('/', (req, res) => {
    res.sendFile(appDir + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('getTouristList', (params) => {
        console.log("params from client")
        console.log(params)
        var clientParams = JSON.parse(params);
        console.log("parsed params")
        console.log(clientParams)
        var tourInstanceID = clientParams.tourInstanceID;
        var coachID = clientParams.coachID;
        var getTouristListQuery = 'select [user].id as UserID,UI.Fullname, UCSN.SeatNumber, TSTT.Status \n ' +
            'from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n ' +
            'inner join UserInfo as UI on [user].UserInfoID = UI.id \n ' +
            'inner join TouristStatus as TSTT on [user].TouristStatus = TSTT.ID \n' +
            'where [user].RoleID = 3 and [user].TourInstanceID = ' + tourInstanceID +
            ' and UCSN.CoachID= ' + coachID + ' and [user].isActive = 1';
        console.log(getTouristListQuery);
        connection.request().query(getTouristListQuery, (err, result) => {
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
            socket.emit('getTouristList', JSON.stringify({
                touristList: touristList
            }))
        })
    });

    socket.on('Scan', (params) => {
        var clientParams = JSON.parse(params)
        var cardCode = clientParams.cardCode;
        console.log("code: " + cardCode)
        var tourInstanceID = clientParams.tourInstanceID;
        var getUserQuery = "select tourInstanceID, UserID from Card where Code='" + cardCode + "'";
        console.log(getUserQuery);
        var UserInfo = {};
        connection.request().query(getUserQuery, (err, result) => {
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
                        connection.request().query(getTouristInfoQuery, (err, result) => {
                            if (err) {
                                getTouristMessage = "ERROR! " + getTouristInfoQuery;
                            } else {
                                getTouristMessage = "SUCCESS! " + getTouristInfoQuery;
                                if (typeof result !== "undefined" && result.recordset.length > 0) {
                                    UserInfo = result.recordset[0];
                                }
                            }

                            io.emit('chat message', getTouristMessage);
                            socket.emit('Scan', JSON.stringify({
                                status: status,
                                fullname: UserInfo.fullname,
                                UserID: UserInfo.UserID,
                                SeatNumber: UserInfo.SeatNumber,
                                TouristStatus: UserInfo.TouristStatus
                            }))
                        })

                        // update tourist status 

                        var updateTouristStatusQuery = "if (select TouristStatus from [user] where id =" + UserID + ") != 1 \n" +
                            "update [user] set TouristStatus = 1 where id =" + UserID + " \n " +
                            "else \n" +
                            "update [user] set TouristStatus = 2 where id =" + UserID;
                        var updateMessage = "";
                        connection.request().query(updateTouristStatusQuery, (err, result) => {
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

    socket.on('Web Login', (params) => {
        var clientParams = JSON.parse(params);
        var username = clientParams.username;
        var password = clientParams.password;
        var authenicateQuery =
            "select fullname, [user].id as UserID, role.ID as RoleID, role" +
            ", [user].IsActive as UserActive, role.IsActive as RoleActive \n " +
            "from [user] \n " +
            "inner join UserInfo on [user].UserInfoID = UserInfo.ID \n " +
            "inner join Role on [user].RoleID = Role.ID \n " +
            "where username ='" + username + "' and password='" + password + "'";
        console.log(authenicateQuery)
        var message = "";
        var status = ""
        var logStatus = "";
        var loggedUser = {};
        connection.request().query(authenicateQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + authenicateQuery;
                status = "FAILED"
                logStatus = "BUG"
            } else {
                message = "SUCCESS! " + authenicateQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    var loggedUser = result.recordset[0];
                    if (loggedUser.UserActive == 0 && loggedUser.RoleActive == 0) {
                        message = "FAILED! " + authenicateQuery + "\n"
                        message += "User no longer active \n";
                        message += "Permission denied \n";
                        status = "FAILED";
                        logStatus = "User no longer active & permission denied"
                    } else {
                        if (loggedUser.RoleActive == 0) {
                            message = "FAILED! " + authenicateQuery + "\n";
                            message += "Permission denied \n"
                            status = "FAILED"
                            logStatus = "Permission denied";
                        } else {
                            if (loggedUser.UserActive == 0) {
                                message = "FAILED! " + authenicateQuery + "\n";
                                message += "User no longer active \n"
                                status = "FAILED"
                                logStatus = "User no longer active"
                            } else {
                                status = "SUCCESS";
                                logStatus = "Username and Password match, User is active"
                            }
                        }
                    }
                } else {
                    message = "FAILED " + authenicateQuery;
                    status = "FAILED"
                    logStatus = "Wrong username or password"
                }

            }
            if (typeof loggedUser === "undefined") {
                loggedUser = {
                    logStatus: logStatus,
                    status: status
                }
            } else {
                loggedUser.status = status;
                loggedUser.logStatus = logStatus;
            }

            socket.emit('Web Login', JSON.stringify(loggedUser))
            io.emit('chat message', message);

        })
    })


    socket.on('Mobile Sent GPS', (params) => {
        var clientParams = JSON.parse(params);
        console.log(clientParams)
        io.emit('chat message', 'gps has sent')
        io.emit('chat message', 'latitude is: ' + clientParams.lat + ' and longitude is: ' + clientParams.long)
        var updateGpsQuery = "update [user] set latitude= " + clientParams.lat + ", longitude=" + clientParams.long +
            " where [user].id=" + clientParams.userID;
        console.log(updateGpsQuery)
        var message = ""
        connection.request().query(updateGpsQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + updateGpsQuery;
            } else {
                message = "SUCCESS " + updateGpsQuery;
            }
            io.emit('chat message', message);
        })
    })

    socket.on('Web Get GPS', (params) => {
        var clientParams = JSON.parse(params);
        var message = "";
        var getGpsQuery = "select [user].id as UserID,latitude, longitude, UserInfo.* \n " +
            "from [user] inner join UserInfo on [user].UserInfoID = UserInfo.ID \n " +
            "where TourInstanceID = " + clientParams.tourInstanceID + " and RoleID=" + clientParams.roleID;
        var message = ""
        var gpsResult = {
            gpsList: []
        };
        connection.request().query(getGpsQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getGpsQuery;
            } else {
                message = "SUCCESS! " + getGpsQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    gpsResult.gpsList = result.recordset;
                }
            }

            io.emit('chat message', message);
            socket.emit('Web Get GPS', JSON.stringify(gpsResult));
        })
    });

    socket.on('Mobile Login', (params) => {
        var clientParams = JSON.parse(params);
        var username = clientParams.username;
        var password = clientParams.password;
        var authenicateQuery =
            "select fullname, CoachID, TourInstanceID, [user].id as UserID, role.ID as RoleID, role" +
            ", [user].IsActive as UserActive, role.IsActive as RoleActive \n " +
            "from [user] \n " +
            "inner join UserInfo on [user].UserInfoID = UserInfo.ID \n " +
            "inner join Role on [user].RoleID = Role.ID \n " +
            "inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
            "where username ='" + username + "' and password='" + password + "'";
        var message = "";
        var status = "";
        var logStatus = "";
        var loggedUser = {};
        connection.request().query(authenicateQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + authenicateQuery;
                status = "FAILED"
                logStatus = "BUG"
            } else {
                message = "SUCCESS! " + authenicateQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    var loggedUser = result.recordset[0];
                    if (loggedUser.UserActive == 0 && loggedUser.RoleActive == 0) {
                        message = "FAILED! " + authenicateQuery + "\n"
                        message += "User no longer active \n";
                        message += "Permission denied \n";
                        status = "FAILED";
                        logStatus = "User no longer active & permission denied"
                    } else {
                        if (loggedUser.RoleActive == 0) {
                            message = "FAILED! " + authenicateQuery + "\n";
                            message += "Permission denied \n"
                            status = "FAILED"
                            logStatus = "Permission denied";
                        } else {
                            if (loggedUser.UserActive == 0) {
                                message = "FAILED! " + authenicateQuery + "\n";
                                message += "User no longer active \n"
                                status = "FAILED"
                                logStatus = "User no longer active"
                            } else {
                                status = "SUCCESS";
                                logStatus = "Username and Password match, User is active"
                            }
                        }
                    }
                } else {
                    message = "FAILED " + authenicateQuery;
                    status = "FAILED"
                    logStatus = "Wrong username or password"
                }
            }
            if (typeof loggedUser === "undefined") {
                loggedUser = {
                    logStatus: logStatus,
                    status: status
                }
            } else {
                loggedUser.status = status;
                loggedUser.logStatus = logStatus;
            }

            socket.emit('Mobile Login', JSON.stringify(loggedUser))
            io.emit('chat message', message);
        })


    })

    socket.on('Get Visit Place Location', (params) => {
        var clientParams = JSON.parse(params);
        var getVisitPlaceLocationQuery = "select VisitingPlace.Name, VisitingPlace.latitude, VisitingPlace.longitude,TVP.priority \n " +
            "from TourInstance inner join Tour_VisitingPlace as TVP on TourInstance.TourID = TVP.TourID \n " +
            "inner join VisitingPlace on TVP.VisitingPlaceID = VisitingPlace.ID \n" +
            "where TourInstance.ID =" + clientParams.tourInstanceID + " and VisitingPlace.IsActive=1";
        console.log(getVisitPlaceLocationQuery);
        var message = ""
        var data = {
            visitingPlaceList: []
        };
        connection.request().query(getVisitPlaceLocationQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getVisitPlaceLocationQuery
            } else {
                message = "SUCCESS! " + getVisitPlaceLocationQuery
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    data.visitingPlaceList = result.recordset;
                }
            }
            socket.emit('Get Visit Place Location', JSON.stringify(data))
            io.emit('chat message', message)
        })
    })

    socket.on('Create Place', (params) => {
        var clientParams = JSON.parse(params);
        var insertPlaceQuery = "Insert into Place (Name,IsActive) VALUES (N'" + clientParams.Name + "',1)";
        var message = "";
        var status = "";
        connection.request().query(insertPlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + insertPlaceQuery
                status = "FAILED"
            } else {
                message = "SUCCESS! " + insertPlaceQuery;
                status = "SUCCESS"
            }
            socket.emit('Create Place', JSON.stringify({
                status: status

            }))
            io.emit('chat message', message)
        })

    })

    socket.on('Get Place List', (params) => {
        var clientParams = JSON.parse(params);
        var getPlaceListQuery = "select * from Place where IsActive=" + clientParams.isActive;
        var message = "";
        var data = {
            placeList: []
        };
        connection.request().query(getPlaceListQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getPlaceListQuery
            } else {
                message = "SUCCESS! " + getPlaceListQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    data.placeList = result.recordset;
                }
            }

            socket.emit('Get Place List', JSON.stringify(data));
            io.emit('chat message', message);
        })

    })

    socket.on('Update Place', (params) => {
        var clientParams = JSON.parse(params);
        var updatePlaceQuery = "update Place set name=N'" + clientParams.name + "' \n" +
            "where id=" + clientParams.placeID;
        var message = "";
        var status = ""
        connection.request().query(updatePlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + updatePlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS! " + updatePlaceQuery;
                status = "SUCCESS"
            }
            socket.emit('Update Place List', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })

    socket.on('Remove Place', (params) => {
        var clientParams = JSON.parse(params);
        var deactivePlaceQuery = "update Place set isActive=0 where id=" + clientParams.placeID;
        var message = "";
        var status = ""
        connection.request().query(deactivePlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + deactivePlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS " + deactivePlaceQuery;
                status = "SUCCESS"
            }

            socket.emit('Remove Place', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })

    socket.on('Reactive Place', (params) => {
        var clientParams = JSON.parse(params);
        var reactivePlaceQuery = "update Place set isActive=1 where id=" + clientParams.placeID;
        var message = "";
        var status = "";
        connection.request().query(reactivePlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + reactivePlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS! " + reactivePlaceQuery;
                status = "SUCCESS"

            }
            socket.emit('Reactive Place', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })
});


http.listen(port, () => {
    console.log('listening on *:' + port);
});