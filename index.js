const app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http);
var mapDetailRequest = require('sync-request');
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

        var clientParams = JSON.parse(params);

        var tourInstanceID = clientParams.tourInstanceID;
        var coachID = clientParams.coachID;
        var getTouristListQuery = 'select [user].id as UserID,UI.Fullname, UCSN.SeatNumber, TSTT.Status \n ' +
            'from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n ' +
            'inner join UserInfo as UI on [user].ID = UI.UserID \n ' +
            'inner join TouristStatus as TSTT on [user].TouristStatus = TSTT.ID \n' +
            'where [user].RoleID = 3 and [user].TourInstanceID = ' + tourInstanceID +
            ' and UCSN.CoachID= ' + coachID + ' and [user].isActive = 1';

        connection.request().query(getTouristListQuery, (err, result) => {
            var message = "";
            var touristList = [];
            if (err) {
                message = "ERROR! " + getTouristListQuery;
            } else {
                message = "SUCCESS! " + getTouristListQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    touristList = result.recordset;

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

        var tourInstanceID = clientParams.tourInstanceID;
        var getUserQuery = "select tourInstanceID, UserID from Card where Code='" + cardCode + "'";

        var UserInfo = {};
        connection.request().query(getUserQuery, (err, result) => {
            var message = "";
            var status = "FAILED";
            if (err) {
                message = "ERROR! " + getUserQuery;
            } else {
                message = "SUCCESS! " + getUserQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {

                    if (tourInstanceID == result.recordset[0].tourInstanceID) {
                        status = "SUCCESS";
                        var UserID = result.recordset[0].UserID
                        var getTouristMessage = "";

                        // get tourist status to response
                        var getTouristInfoQuery = "select fullname, [user].id as UserID, SeatNumber, TouristStatus \n " +
                            "from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n " +
                            "inner join UserInfo as UI on [user].ID = UI.Userid \n " +
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
            "inner join UserInfo on [user].ID = UserInfo.UserID \n " +
            "inner join Role on [user].RoleID = Role.ID \n " +
            "where username ='" + username + "' and password='" + password + "'";

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

        io.emit('chat message', 'gps has sent')
        io.emit('chat message', 'latitude is: ' + clientParams.lat + ' and longitude is: ' + clientParams.long)
        var updateGpsQuery = "update [user] set latitude= " + clientParams.lat + ", longitude=" + clientParams.long +
            " where [user].id=" + clientParams.userID;

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
        var getGpsQuery = "select [user].id as UserID,latitude, longitude,  UserInfo.Fullname, UserInfo.PhoneNumber, Tour.Name as TourName \n" +
            "from [user] inner join UserInfo on [user].ID = UserInfo.UserID \n" +
            "inner join TourInstance on TourInstance.ID=[user].TourInstanceID \n" +
            "inner join Tour on TourInstance.TourID = Tour.ID \n"
        if (clientParams.roleID == 0) {
            getGpsQuery += "where TourInstanceID =" + clientParams.tourInstanceID
        } else {
            getGpsQuery += "where TourInstanceID = " + clientParams.tourInstanceID + " and RoleID=" + clientParams.roleID;
        }

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
            "inner join UserInfo on [user].ID = UserInfo.UserID \n " +
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
            "where TourInstance.ID =" + clientParams.tourInstanceID + " and VisitingPlace.IsActive=1 \n" +
            "order by priority";

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
            socket.emit('Update Place', JSON.stringify({
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

    socket.on('Mobile Send Pick Up Location', (params) => {
        var clientParams = JSON.parse(params);
        var date = new Date(); //new date from UTC 00

        var hour = date.getHours()
        date.setHours((hour + 7)); // move it to UTC +07

        date.setHours(clientParams.hour); //set to pick up time in UTC +07
        date.setMinutes(clientParams.min);

        var insertDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() +
            " " + date.getHours() + ":" + date.getMinutes() + ":" + "00.000";

        var addPickUpLocationQuery = "INSERT into PickUp (Latitude,Longitude,PickUpTime,UserID,TourInstanceID) \nVALUES" +
            "(" + clientParams.lat + "," + clientParams.long + ",'" + insertDate + "'," +
            clientParams.userID + "," + clientParams.tourInstanceID + ")"

        var message = "";
        connection.request().query(addPickUpLocationQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + addPickUpLocationQuery;
            } else {
                message = "SUCCESS! " + addPickUpLocationQuery;
            }
            io.emit('chat message', message)
        })
        var notification = ""
        var locationDetail = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + clientParams.lat + ',' + clientParams.long;

        var response = mapDetailRequest('get', locationDetail);
        var addressResult = JSON.parse(response.getBody('utf8'));


        var pickUpAddress = ""
        for (var i = 0; i < 4; i++) {
            pickUpAddress += addressResult.results[0].address_components[i].short_name + ", ";
        }
        pickUpAddress += addressResult.results[0].address_components[4].short_name
        if (pickUpAddress === "") {
            pickUpAddress = "UNKNOW"
        }
        var getDriverAndTourguideInfoQuery = "select Fullname, PhoneNumber, [user].id, Coach.LicensePlate \n" +
            "from [user] inner join UserInfo on [user].ID=UserInfo.UserID \n" +
            "inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
            "inner join Coach on UCSN.CoachID = Coach.ID \n" +
            "where [user].RoleID = 1 or [user].RoleID=2 and [user].TourInstanceID =" + clientParams.tourInstanceID + "and UCSN.CoachID=" + clientParams.coachID + " \n" +
            "order by RoleID"
        message = "";
        var userList = [];
        var notificationContent = {};
        connection.request().query(getDriverAndTourguideInfoQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getDriverAndTourguideInfoQuery
            } else {
                message = "SUCCESS! " + getDriverAndTourguideInfoQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    userList = result.recordset;
                    notification +=
                        "Thông báo đổi địa điểm đón! \n" +
                        "Xin chào " + userList[0].Fullname + ", xe mang biển số: " + userList[0].LicensePlate + ". \n" +
                        "Hướng dẫn viên " + userList[1].Fullname + " đã thay đổi địa điểm đón tiếp theo trong lịch trình." +
                        "Địa điểm mới là: " + pickUpAddress + ". \n" +
                        "Vào lúc" + date.getHours() + " giờ " + date.getMinutes() + " phút, \n" +
                        "ngày " + date.getDate() + " tháng " + (date.getMonth() + 1) + " năm " + date.getFullYear() + ". \n" +
                        "Vui lòng ấn nút Điểm Đón Tiếp Theo để nhìn trên bản đồ."



                    notificationContent = {
                        senderID: userList[1].id,
                        receiverID: userList[0].id,
                        type: 1
                    }
                }


            }

            io.emit('chat message', message);
            message = "";
            if (typeof notificationContent !== "undefined") {
                var insertNotificationQuery = "INSERT into Notification (Message,Type,SenderID,ReceiverID) \n VALUES " +
                    "(N'" + notification + "'," + notificationContent.type + "," +
                    notificationContent.senderID + "," + notificationContent.receiverID + ")"
                connection.request().query(insertNotificationQuery, (err, result) => {
                    if (err) {
                        message = "ERROR! " + insertNotificationQuery;
                    } else {
                        message = "SUCCESS! " + insertNotificationQuery;
                    }
                    io.emit('chat message', message);
                    socket.broadcast.emit('Mobile Receiver Pick Up Notification', JSON.stringify({
                        tourInstanceID: clientParams.tourInstanceID,
                        coachID: clientParams.coachID,
                        receiverID: notificationContent.receiverID,
                        lat: clientParams.lat,
                        long: clientParams.long,
                        hour: date.getHours(),
                        min: date.getMinutes(),
                        date: date.getDate(),
                        month: date.getMonth() + 1,
                        year: date.getFullYear(),
                        notification: notification
                    }))
                })
            }
        })
    })

    socket.on('Mobile Get Schedule', (params) => {
        var clientParams = JSON.parse(params);
        var getScheduleQuery = "select Schedule.StartTime, Schedule.EndTime, Activity, VisitingPlaceID, \n" +
            "VisitingPlace.Name as VisitPlaceName,TourTime, Latitude,Longitude, TourInstanceDetailId \n" +
            "from Schedule inner join TourInstance_Detail as TID on Schedule.TourInstanceDetailId=TID.id \n" +
            "inner join TourInstance on TID.TourInstanceID = TourInstance.ID \n" +
            "inner join TourInstance_Status as TIS on TourInstance.Status = TIS.ID \n" +
            "inner join Tour on TourInstance.TourID = Tour.ID \n" +
            "left join VisitingPlace on VisitingPlaceID = VisitingPlace.ID \n" +
            "where TourInstanceID =" + clientParams.tourInstanceID + " \n" +
            "order by TourInstanceDetailId,Schedule.StartTime, Schedule.EndTime"

        var message = "";
        var data = [];

        connection.request().query(getScheduleQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getScheduleQuery;
            } else {
                message = "SUCCCESS! " + getScheduleQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    var tourTimeScheduleList = [];
                    var scheduleList = result.recordset;

                    var marker = 0;
                    for (var i = 0; i < scheduleList.length - 1; i++) {
                        tourTimeScheduleList.push(scheduleList[i])

                        if (scheduleList[i].TourInstanceDetailId != scheduleList[i + 1].TourInstanceDetailId) {
                            data.push({
                                tourTimeScheduleList: tourTimeScheduleList
                            })

                            tourTimeScheduleList = [];
                        }
                        marker = i;
                    }

                    if (scheduleList[marker].TourInstanceDetailId != scheduleList[marker + 1].TourInstanceDetailId) {
                        data.push({
                            tourTimeScheduleList: tourTimeScheduleList
                        })
                        tourTimeScheduleList = [];
                        tourTimeScheduleList.push(scheduleList[marker + 1])
                        data.push({
                            tourTimeScheduleList: tourTimeScheduleList
                        })
                    } else {
                        tourTimeScheduleList.push(scheduleList[marker + 1]);
                        data.push({
                            tourTimeScheduleList: tourTimeScheduleList
                        })
                    }

                }
            }
            io.emit('chat message', message)
            socket.emit('Mobile Get Schedule', JSON.stringify(data));
        })
    })

    socket.on('Create Visit Place', (params) => {
        var clientParams = JSON.parse(params);
        var insertVisitPlaceQuery = "Insert into VisitingPlace (Name,IsActive,Latitude,Longitude) \n" +
            "VALUES (N'" + clientParams.Name + "',1," + clientParams.latitude + "," + clientParams.longitude + ")";
        var message = "";
        var status = "";
        connection.request().query(insertVisitPlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + insertVisitPlaceQuery
                status = "FAILED"
            } else {
                message = "SUCCESS! " + insertVisitPlaceQuery;
                status = "SUCCESS"
            }
            socket.emit('Create Visit Place', JSON.stringify({
                status: status

            }))
            io.emit('chat message', message)
        })

    })

    socket.on('Update Visit Place', (params) => {
        var clientParams = JSON.parse(params);
        var updateVisitPlaceQuery = "update VisitingPlace set name=N'" + clientParams.name + "', \n" +
            "Latitude=" + clientParams.latitude + ", \n" +
            "Longitude=" + clientParams.longitude + ", \n" +
            "where id=" + clientParams.placeID;
        var message = "";
        var status = ""
        connection.request().query(updateVisitPlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + updateVisitPlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS! " + updateVisitPlaceQuery;
                status = "SUCCESS"
            }
            socket.emit('Update Visit Place', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })

    socket.on('Remove Visit Place', (params) => {
        var clientParams = JSON.parse(params);
        var deactiveVisitPlaceQuery = "update VisitingPlace set isActive=0 where id=" + clientParams.visitPlaceID;
        var message = "";
        var status = ""
        connection.request().query(deactiveVisitPlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + deactiveVisitPlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS " + deactiveVisitPlaceQuery;
                status = "SUCCESS"
            }

            socket.emit('Remove Visit Place', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })

    socket.on('Reactive Visit Place', (params) => {
        var clientParams = JSON.parse(params);
        var reactiveVisitPlaceQuery = "update VisitingPlace set isActive=1 where id=" + clientParams.visitPlaceID;
        var message = "";
        var status = "";
        connection.request().query(reactiveVisitPlaceQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + reactiveVisitPlaceQuery;
                status = "FAILED"
            } else {
                message = "SUCCESS! " + reactiveVisitPlaceQuery;
                status = "SUCCESS"

            }
            socket.emit('Reactive Visit Place', JSON.stringify({
                status: status
            }))
            io.emit('chat message', message)
        })
    })

    socket.on('Get Visit Place List', (params) => {
        var clientParams = JSON.parse(params);
        var getPlaceListQuery = "select * from VisitingPlace where IsActive=" + clientParams.isActive;
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

            socket.emit('Get Visit Place List', JSON.stringify(data));
            io.emit('chat message', message);
        })

    })


    socket.on('Mobile Get Others Location', (params) => {
        var clientParams = JSON.parse(params);
        var getGpsQuery = "select Latitude, Longitude, Fullname, PhoneNumber, Role.role, SeatNumber, [user].ID  \n" +
            "from [user] inner join UserInfo on [user].ID = UserInfo.UserID \n" +
            "inner join User_Coach_SeatNumber as UCSN on [user].ID = UCSN.UserID \n" +
            "inner join Coach on UCSN.CoachID = Coach.ID \n" +
            "inner join Role on [user].RoleID = Role.ID \n" +
            "Where [user].TourInstanceID =" + clientParams.tourInstanceID + " and CoachID = " + clientParams.coachID;
        if (clientParams.roleID != 0) {
            getGpsQuery += " and RoleID=" + clientParams.roleID + " \n" +
                "Order by SeatNumber";
        } else {
            getGpsQuery += "\n Order by SeatNumber"
        }
        var message = "";
        var data = {
            userLocationList: []
        };
        connection.request().query(getGpsQuery, (err, result) => {
            if (err) {
                message = "ERROR! " + getGpsQuery
            } else {
                message = "SUCCESS! " + getGpsQuery;
                if (typeof result !== "undefined" && result.recordset.length > 0) {
                    data.userLocationList = result.recordset;
                }
            }
            io.emit('chat message', message);
            socket.emit('Mobile Get Others Location', data);
        })
    })
});


http.listen(port, () => {
    console.log('listening on *:' + port);
});