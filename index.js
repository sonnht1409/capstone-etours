 "use strict"
 const app = require('express')();
 var http = require('http').Server(app);
 const io = require('socket.io')(http);
 var mapDetailRequest = require('sync-request');
 var port = 8080;
 var path = require('path');
 var appDir = path.dirname(require.main.filename);
 console.log(appDir)
 const sql = require('mssql');
 const connection = new sql.ConnectionPool({
     user: 'etours',
     password: "$Son01627335534",
     server: "etours1.database.windows.net",
     driver: 'tedious',
     database: 'etours',
     options: {
         encrypt: true
     }
 })
 const statusMessageError = "ERROR! ";
 const statusMessageSuccess = "SUCCESS! ";
 const statusFailed = "FAILED";
 const statusSuccess = "SUCCESS"



 connection.connect(err => {
     if (err) {
         console.log("have error");
         console.log(err)
     } else {

     }
 })
 app.get('/', (req, res) => {

     res.sendFile(appDir + '/index.html');
 });

 io.on('connection', (socket) => {
     socket.on('log message', (msg) => {
         console.log(msg)
         io.emit('log message', msg);
     });

     socket.on('getTouristList', (params) => {

         var clientParams = JSON.parse(params);

         var tourInstanceID = clientParams.tourInstanceID;
         var coachID = clientParams.coachID;
         var getTouristListQuery = 'select [user].id as UserID,UI.Fullname, UCSN.SeatNumber, TSTT.Status,Card.Code as CardCode \n ' +
             'from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n ' +
             'inner join UserInfo as UI on [user].ID = UI.UserID \n ' +
             'inner join TouristStatus as TSTT on [user].TouristStatus = TSTT.ID \n' +
             'inner join Card on Card.UserID = [user].id \n' +
             'where [user].RoleID = 3 and [user].TourInstanceID = ' + tourInstanceID +
             ' and UCSN.CoachID= ' + coachID + ' and [user].isActive = 1';

         connection.request().query(getTouristListQuery, (err, result) => {
             var message = "";
             var touristList = [];
             if (err) {
                 message = statusMessageError + getTouristListQuery;
             } else {
                 message = statusMessageSuccess + getTouristListQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     touristList = result.recordset;

                 }
             }
             io.emit('log message', message);
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
             var status = statusFailed;
             if (err) {
                 message = statusMessageError + getUserQuery;
             } else {
                 message = statusMessageSuccess + getUserQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {

                     if (tourInstanceID == result.recordset[0].tourInstanceID) {
                         status = statusSuccess;
                         var UserID = result.recordset[0].UserID
                         var getTouristMessage = "";

                         // get tourist status to response
                         var getTouristInfoQuery = "select fullname, [user].id as UserID, SeatNumber, TouristStatus \n " +
                             "from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n " +
                             "inner join UserInfo as UI on [user].ID = UI.UserID \n " +
                             "where [user].id = " + UserID;
                         connection.request().query(getTouristInfoQuery, (err, result) => {
                             if (err) {
                                 getTouristMessage = statusMessageError + getTouristInfoQuery;
                             } else {
                                 getTouristMessage = statusMessageSuccess + getTouristInfoQuery;
                                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                                     UserInfo = result.recordset[0];
                                 }
                             }

                             io.emit('log message', getTouristMessage);
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
                                 updateMessage = statusMessageError + updateTouristStatusQuery;
                             } else {
                                 updateMessage = statusMessageSuccess + updateTouristStatusQuery;
                             }
                             io.emit('log message', updateMessage);
                         })


                     }
                 }
             }
             io.emit('log message', message)

         })
     });

     socket.on('Web Login', (params) => {
         var clientParams = JSON.parse(params);
         var User = require("./entities/user")
         var UserDAO = require("./dao/UserDAO")
         var user = new User();
         user.username = clientParams.username.toString();
         user.password = clientParams.password.toString();
         var userDAO = new UserDAO();
         userDAO.webLogin(user.username, user.password, (result) => {
             socket.emit('Web Login', JSON.stringify(result.loggedUser))
             io.emit('log message', result.message);
         });



     })


     socket.on('Mobile Sent GPS', (params) => {
         var clientParams = JSON.parse(params);

         io.emit('log message', 'gps has sent')
         io.emit('log message', 'latitude is: ' + clientParams.lat + ' and longitude is: ' + clientParams.long)
         var updateGpsQuery = "update [user] set latitude= " + clientParams.lat + ", longitude=" + clientParams.long +
             " where [user].id=" + clientParams.userID;

         var message = ""
         connection.request().query(updateGpsQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateGpsQuery;
             } else {
                 message = statusMessageSuccess + updateGpsQuery;
             }
             io.emit('log message', message);
         })
     })

     socket.on('Web Get GPS', (params) => {
         var clientParams = JSON.parse(params);
         var message = "";
         var getGpsQuery = "select [user].id as UserID,latitude, longitude,  UserInfo.Fullname, UserInfo.PhoneNumber, Tour.Name as TourName, RoleID \n" +
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
                 message = statusMessageError + getGpsQuery;
             } else {
                 message = statusMessageSuccess + getGpsQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     gpsResult.gpsList = result.recordset;
                 }
             }

             io.emit('log message', message);
             socket.emit('Web Get GPS', JSON.stringify(gpsResult));
         })
     });

     socket.on('Mobile Login', (params) => {
         var clientParams = JSON.parse(params);
         var username = clientParams.username;
         var password = clientParams.password;
         var authenicateQuery =
             "select fullname, CoachID, Coach.LicensePlate, [user].TourInstanceID, [user].id as UserID, role.ID as RoleID, role" +
             ", [user].IsActive as UserActive, role.IsActive as RoleActive \n " +
             "from [user] \n " +
             "inner join UserInfo on [user].ID = UserInfo.UserID \n " +
             "inner join Role on [user].RoleID = Role.ID \n " +
             "inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
             "inner join Coach on UCSN.CoachID=Coach.ID \n" +
             "where username ='" + username + "' and password='" + password + "'";
         var message = "";
         var status = "";
         var logStatus = "";
         var loggedUser = {};
         connection.request().query(authenicateQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + authenicateQuery;
                 status = statusFailed
                 logStatus = "BUG"
             } else {
                 message = statusMessageSuccess + authenicateQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     var loggedUser = result.recordset[0];
                     if (loggedUser.UserActive == 0 && loggedUser.RoleActive == 0) {
                         message = "FAILED! " + authenicateQuery + "\n"
                         message += "User no longer active \n";
                         message += "Permission denied \n";
                         status = statusFailed;
                         logStatus = "User no longer active & permission denied"
                     } else {
                         if (loggedUser.RoleActive == 0) {
                             message = "FAILED! " + authenicateQuery + "\n";
                             message += "Permission denied \n"
                             status = statusFailed
                             logStatus = "Permission denied";
                         } else {
                             if (loggedUser.UserActive == 0) {
                                 message = "FAILED! " + authenicateQuery + "\n";
                                 message += "User no longer active \n"
                                 status = statusFailed
                                 logStatus = "User no longer active"
                             } else {
                                 status = statusSuccess;
                                 logStatus = "Username and Password match, User is active"
                             }
                         }
                     }
                 } else {
                     message = "FAILED " + authenicateQuery;
                     status = statusFailed
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
             io.emit('log message', message);
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
                 message = statusMessageError + getVisitPlaceLocationQuery
             } else {
                 message = statusMessageSuccess + getVisitPlaceLocationQuery
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     data.visitingPlaceList = result.recordset;
                 }
             }
             socket.emit('Get Visit Place Location', JSON.stringify(data))
             io.emit('log message', message)
         })
     })

     socket.on('Create Place', (params) => {
         var clientParams = JSON.parse(params);
         var insertPlaceQuery = "Insert into Place (Name,IsActive) VALUES (N'" + clientParams.Name + "',1)";
         var message = "";
         var status = "";
         connection.request().query(insertPlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertPlaceQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + insertPlaceQuery;
                 status = statusSuccess
             }
             socket.emit('Create Place', JSON.stringify({
                 status: status

             }))
             io.emit('log message', message)
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
                 message = statusMessageError + getPlaceListQuery
             } else {
                 message = statusMessageSuccess + getPlaceListQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     data.placeList = result.recordset;
                 }
             }

             socket.emit('Get Place List', JSON.stringify(data));
             io.emit('log message', message);
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
                 message = statusMessageError + updatePlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updatePlaceQuery;
                 status = statusSuccess
             }
             socket.emit('Update Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
         })
     })

     socket.on('Remove Place', (params) => {
         var clientParams = JSON.parse(params);
         var deactivePlaceQuery = "update Place set isActive=0 where id=" + clientParams.placeID;
         var message = "";
         var status = ""
         connection.request().query(deactivePlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + deactivePlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + deactivePlaceQuery;
                 status = statusSuccess
             }

             socket.emit('Remove Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
         })
     })

     socket.on('Reactive Place', (params) => {
         var clientParams = JSON.parse(params);
         var reactivePlaceQuery = "update Place set isActive=1 where id=" + clientParams.placeID;
         var message = "";
         var status = "";
         connection.request().query(reactivePlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactivePlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactivePlaceQuery;
                 status = statusSuccess

             }
             socket.emit('Reactive Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
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
                 message = statusMessageError + addPickUpLocationQuery;
             } else {
                 message = statusMessageSuccess + addPickUpLocationQuery;
             }
             io.emit('log message', message)
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
                 message = statusMessageError + getDriverAndTourguideInfoQuery
             } else {
                 message = statusMessageSuccess + getDriverAndTourguideInfoQuery;
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

             io.emit('log message', message);
             message = "";
             if (typeof notificationContent !== "undefined") {
                 var insertNotificationQuery = "INSERT into Notification (Message,Type,SenderID,ReceiverID) \n VALUES " +
                     "(N'" + notification + "'," + notificationContent.type + "," +
                     notificationContent.senderID + "," + notificationContent.receiverID + ")"
                 connection.request().query(insertNotificationQuery, (err, result) => {
                     if (err) {
                         message = statusMessageError + insertNotificationQuery;
                     } else {
                         message = statusMessageSuccess + insertNotificationQuery;
                     }
                     io.emit('log message', message);
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
         var getScheduleQuery = "select Schedule.ID as scheduleID,Schedule.StartTime, Schedule.EndTime, Activity, VisitingPlaceID, \n" +
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
                 message = statusMessageError + getScheduleQuery;
             } else {
                 message = statusMessageSuccess + getScheduleQuery;
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
             io.emit('log message', message)
             socket.emit('Mobile Get Schedule', JSON.stringify(data));
         })
     })

     socket.on('Create Visit Place', (params) => {
         var clientParams = JSON.parse(params);
         var insertVisitPlaceQuery = "Insert into VisitingPlace (Name,IsActive,Latitude,Longitude,Type) \n" +
             "VALUES (N'" + clientParams.name + "',1," + clientParams.latitude + "," + clientParams.longitude + "," +
             clientParams.typeID + ")";
         var message = "";
         var status = "";
         connection.request().query(insertVisitPlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertVisitPlaceQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + insertVisitPlaceQuery;
                 status = statusSuccess
             }
             socket.emit('Create Visit Place', JSON.stringify({
                 status: status

             }))
             io.emit('log message', message)
         })

     })

     socket.on('Update Visit Place', (params) => {
         var clientParams = JSON.parse(params);
         var updateVisitPlaceQuery = "update VisitingPlace set name=N'" + clientParams.name + "', \n" +
             "Latitude=" + clientParams.latitude + ", \n" +
             "Longitude=" + clientParams.longitude + ", \n" +
             "Type =" + clientParams.typeID + " \n" +
             "where id=" + clientParams.visitPlaceID;
         var message = "";
         var status = ""
         connection.request().query(updateVisitPlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateVisitPlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateVisitPlaceQuery;
                 status = statusSuccess
             }
             socket.emit('Update Visit Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
         })
     })

     socket.on('Remove Visit Place', (params) => {
         var clientParams = JSON.parse(params);
         var deactiveVisitPlaceQuery = "update VisitingPlace set isActive=0 where id=" + clientParams.visitPlaceID;
         var message = "";
         var status = ""
         connection.request().query(deactiveVisitPlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + deactiveVisitPlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + deactiveVisitPlaceQuery;
                 status = statusSuccess
             }

             socket.emit('Remove Visit Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
         })
     })

     socket.on('Reactive Visit Place', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveVisitPlaceQuery = "update VisitingPlace set isActive=1 where id=" + clientParams.visitPlaceID;
         var message = "";
         var status = "";
         connection.request().query(reactiveVisitPlaceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveVisitPlaceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveVisitPlaceQuery;
                 status = statusSuccess

             }
             socket.emit('Reactive Visit Place', JSON.stringify({
                 status: status
             }))
             io.emit('log message', message)
         })
     })

     socket.on('Get Visit Place List', (params) => {
         var clientParams = JSON.parse(params);
         var getPlaceListQuery = "select VP.ID as visitPlaceID, VP.Name as visitPlaceName, VP.isActive," +
             "Latitude,Longitude, Type as typeID, VPT.Name as typeName \n" +
             "from VisitingPlace as VP inner join VisitingPlaceType as VPT on VP.Type=VPT.ID \n" +
             "where VP.IsActive = " + clientParams.isActive + "\n" +
             "order by typeID";
         var message = "";
         var visitingPlaceList = []
         connection.request().query(getPlaceListQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getPlaceListQuery
             } else {
                 message = statusMessageSuccess + getPlaceListQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     visitingPlaceList = result.recordset;
                 }
             }

             socket.emit('Get Visit Place List', JSON.stringify({
                 visitingPlaceList: visitingPlaceList
             }));
             io.emit('log message', message);
         })

     })


     socket.on('Mobile Get Others Location', (params) => {
         var clientParams = JSON.parse(params);
         var getGpsQuery = "select Latitude, Longitude, Fullname, PhoneNumber, Role.role, SeatNumber, [user].ID as UserID \n" +
             "from [user] inner join UserInfo on [user].ID = UserInfo.UserID \n" +
             "inner join User_Coach_SeatNumber as UCSN on [user].ID = UCSN.UserID \n" +
             "inner join Coach on UCSN.CoachID = Coach.ID \n" +
             "inner join Role on [user].RoleID = Role.ID \n" +
             "Where [user].TourInstanceID =" + clientParams.tourInstanceID + " and CoachID = " + clientParams.coachID;
         if (clientParams.roleID != 0) {
             getGpsQuery += " and RoleID=" + clientParams.roleID + " \n" +
                 "Order by RoleID,SeatNumber";
         } else {
             getGpsQuery += " and RoleID <>" + clientParams.currentRoleID + "\n"
             getGpsQuery += "Order by RoleID,SeatNumber"
         }
         var message = "";
         var data = {
             userLocationList: []
         };
         connection.request().query(getGpsQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getGpsQuery
             } else {
                 message = statusMessageSuccess + getGpsQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     data.userLocationList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Mobile Get Others Location', JSON.stringify(data));
         })
     })

     socket.on('Mobile Gather Tourist', (params) => {
         var clientParams = JSON.parse(params);

         var message = "Xin quý hành khách vui lòng đến điểm tập trung!";
         var queryMEssage = "";
         if (typeof clientParams.userList === "undefined" || clientParams.userList.length == 0) {
             var getTouristListQuery = "select [user].ID as UserID \n" +
                 "from [user] inner join User_Coach_SeatNumber as UCSN on [user].ID = UCSN.UserID \n" +
                 "where [user].TourInstanceID=" + clientParams.tourInstanceID + " and RoleID = 3 and CoachID = " + clientParams.coachID;

             connection.request().query(getTouristListQuery, (err, result) => {
                 var userList = [];
                 if (err) {
                     queryMEssage = statusMessageError + getTouristListQuery;
                 } else {
                     queryMEssage = statusMessageSuccess + getTouristListQuery;

                     if (typeof result !== "undefined" && result.recordset.length > 0) {
                         userList = result.recordset;
                     }
                 }
                 io.emit('log message', queryMEssage);
                 socket.broadcast.emit('Mobile Gather Tourist', JSON.stringify({
                     tourInstanceID: clientParams.tourInstanceID,
                     coachID: clientParams.coachID,
                     userList: userList,
                     message: message
                 }))
             })
         } else {
             socket.broadcast.emit('Mobile Gather Tourist', JSON.stringify({
                 tourInstanceID: clientParams.tourInstanceID,
                 coachID: clientParams.coachID,
                 userList: clientParams.userList,
                 message: message
             }))
         }
     })

     socket.on('Mobile Login By Card', (params) => {
         console.log(params)
         var clientParams = JSON.parse(params);
         console.log(clientParams)
         var authenicateQuery =
             "select fullname, CoachID, [user].TourInstanceID, [user].id as UserID, role.ID as RoleID, role" +
             ", [user].IsActive as UserActive, role.IsActive as RoleActive \n " +
             "from Card inner join [user] on Card.UserID = [user].id \n " +
             "inner join UserInfo on [user].ID = UserInfo.UserID \n " +
             "inner join Role on [user].RoleID = Role.ID \n " +
             "inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
             "where Card.Code='" + clientParams.cardCode + "'";
         console.log(authenicateQuery)
         var message = "";
         var status = "";
         var logStatus = "";
         var loggedUser = {};
         connection.request().query(authenicateQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + authenicateQuery;
                 status = statusFailed
                 logStatus = "BUG"
             } else {
                 message = statusMessageSuccess + authenicateQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     var loggedUser = result.recordset[0];
                     if (loggedUser.UserActive == 0 && loggedUser.RoleActive == 0) {
                         message = "FAILED! " + authenicateQuery + "\n"
                         message += "User no longer active \n";
                         message += "Permission denied \n";
                         status = statusFailed;
                         logStatus = "User no longer active & permission denied"
                     } else {
                         if (loggedUser.RoleActive == 0) {
                             message = "FAILED! " + authenicateQuery + "\n";
                             message += "Permission denied \n"
                             status = statusFailed
                             logStatus = "Permission denied";
                         } else {
                             if (loggedUser.UserActive == 0) {
                                 message = "FAILED! " + authenicateQuery + "\n";
                                 message += "User no longer active \n"
                                 status = statusFailed
                                 logStatus = "User no longer active"
                             } else {
                                 status = statusSuccess;
                                 logStatus = "Username and Password match, User is active"
                             }
                         }
                     }
                 } else {
                     message = "FAILED " + authenicateQuery;
                     status = statusFailed
                     logStatus = "Wrong Card"
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
             io.emit('log message', message)
             socket.emit('Mobile Login By Card', JSON.stringify(loggedUser));
         })
     })

     socket.on('Get Visit Place Type List', (params) => {
         var clientParams = JSON.parse(params);
         var getVisitPlaceTypeQuery = "select * from VisitingPlaceType where isActive=" + clientParams.isActive;
         var message = "";
         var visitingPlaceTypeList = [];
         connection.request().query(getVisitPlaceTypeQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getVisitPlaceTypeQuery;
             } else {
                 message = statusMessageSuccess + getVisitPlaceTypeQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     visitingPlaceTypeList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Visit Place Type List', JSON.stringify({
                 visitingPlaceTypeList: visitingPlaceTypeList
             }))
         })
     })

     socket.on('Create Visit Place Type', (params) => {
         var clientParams = JSON.parse(params)
         var createVisitPlaceTypeQuery = "INSERT into VisitingPlaceType (Name,IsActive) \n" +
             "VALUES(N'" + clientParams.name + "',1)";
         var message = "";
         var status = "";
         connection.request().query(createVisitPlaceTypeQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + createVisitPlaceTypeQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + createVisitPlaceTypeQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Create Visit Place Type', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Update Visit Place Type', (params) => {
         var clientParams = JSON.parse(params);
         var updateVisitPlaceTypeQuery = "UPDATE VisitingPlaceType set \n" +
             "name=N'" + clientParams.name + "' \n" +
             "where ID=" + clientParams.visitingPlaceTypeID;
         var message = "";
         var status = "";
         connection.request().query(updateVisitPlaceTypeQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateVisitPlaceTypeQuery
                 status = statusFailed;
             } else {
                 message = statusMessageSuccess + updateVisitPlaceTypeQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Update Visit Place Type', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Visit Place Type', (params) => {
         var clientParams = JSON.parse(params);
         var removeVisitPlaceTypeQuery = "UPDATE VisitingPlaceType set IsActive=0 \n" +
             "where ID=" + clientParams.visitingPlaceTypeID;
         var message = "";
         var status = "";
         connection.request().query(removeVisitPlaceTypeQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeVisitPlaceTypeQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeVisitPlaceTypeQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Remove Visit Place Type', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Visit Place Type', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveVisitPlaceTypeQuery = "UPDATE VisitingPlaceType set IsActive=1 \n" +
             "where ID=" + clientParams.visitingPlaceTypeID;
         var message = "";
         var status = "";
         connection.request().query(reactiveVisitPlaceTypeQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveVisitPlaceTypeQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveVisitPlaceTypeQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Reactive Visit Place Type', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reschedule Time', (params) => {
         var clientParams = JSON.parse(params);
         var scheduleList = clientParams.scheduleList;
         scheduleList.forEach(function(element) {
             if (element.startMonth < 10) {
                 element.startMonth = "0" + element.startMonth
             }
             if (element.startDate < 10) {
                 element.startDate = "0" + element.startDate
             }
             if (element.endDate < 10) {
                 element.endDate = "0" + element.endDate
             }
             if (element.endMonth < 10) {
                 element.endMonth = "0" + element.endMonth
             }
             if (element.startHour < 10) {
                 element.startHour = "0" + element.startHour
             }
             if (element.startMin < 10) {
                 element.startMin = "0" + element.startMin;
             }
             if (element.endHour < 10) {
                 element.endHour = "0" + element.endHour
             }
             if (element.endMin < 10) {
                 element.endMin = "0" + element.endMin
             }
             var updateScheduleQuery = "UPDATE Schedule set \n" +
                 "startTime='" + element.startYear + "-" + element.startMonth + "-" + element.startDate + " " + element.startHour + ":" + element.startMin + ":00.000', \n" +
                 "endTime='" + element.endYear + "-" + element.endMonth + "-" + element.endDate + " " + element.endHour + ":" + element.endMin + ":00.000' \n" +
                 "where id=" + element.scheduleID

             var message = "";
             connection.request().query(updateScheduleQuery, (err, result) => {
                 if (err) {
                     message = statusMessageError + updateScheduleQuery;
                 } else {
                     message = statusMessageSuccess + updateScheduleQuery
                 }
                 io.emit('log message', message)
             })
         }, this);

     })

     socket.on('Driver Get Next Pick Up', (params) => {
         var clientParams = JSON.parse(params)
         var getTourguideIdQuery = "select [user].id \n" +
             "from [user] inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
             "where TourInstanceID=" + clientParams.tourInstanceID + " and CoachID=" + clientParams.coachID +
             " and [user].RoleID=2"
         var message = "";
         connection.request().query(getTourguideIdQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTourguideIdQuery;
                 io.emit('log message', message)
             } else {
                 message = statusMessageSuccess + getTourguideIdQuery;
                 io.emit('log message', message)
                 message = "";
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     var getPickUpQuery = "select TOP 1 * \n" +
                         "from PickUp \n" +
                         "where UserID=" + result.recordset[0].id + " and TourInstanceID=" + clientParams.tourInstanceID + " \n" +
                         "order by AddedTime DESC";
                     var pickUpInformation = {};

                     connection.request().query(getPickUpQuery, (err, result) => {
                         if (err) {
                             message = statusMessageError + getPickUpQuery;
                         } else {
                             message = statusMessageSuccess + getPickUpQuery;
                             if (typeof result !== "undefined" && result.recordset.length > 0) {

                                 var pickUpTime = result.recordset[0].PickUpTime;
                                 var date = new Date(pickUpTime.toString())
                                 pickUpInformation = {
                                     latitude: result.recordset[0].Latitude,
                                     longitude: result.recordset[0].Longitude,
                                     hour: date.getHours(),
                                     min: date.getMinutes(),
                                     date: date.getDate(),
                                     month: (date.getMonth() + 1),
                                     year: date.getFullYear()
                                 }
                             }
                         }
                         io.emit('log message', message);
                         socket.emit('Driver Get Next Pick Up', JSON.stringify(pickUpInformation))
                     })
                 }
             }
         })
     })

     socket.on('Mobile Send Request', (params) => {
         var clientParams = JSON.parse(params);
         var header = "";
         if (clientParams.type == 2) {
             header = "Yêu cầu thay đổi lộ trình! \n"
         }
         if (clientParams.type == 3) {
             header = "Thông báo sự cố! \n"
         }
         var insertNotificationQuery = "INSERT INTO Notification (Message,Type,SenderID,ReceiverID) \n" +
             "VALUES(N'" + header + clientParams.message + "'," + clientParams.type + "," + clientParams.userID + ",0)";
         var message = "";
         connection.request().query(insertNotificationQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertNotificationQuery;
             } else {
                 message = statusMessageSuccess + insertNotificationQuery;

             }
             io.emit('log message', message);
             // push notification
             socket.broadcast.emit('Web Trigger Notification', JSON.stringify({}))
         })
     })

     socket.on('Mobile Get Notifications', (params) => {
         var clientParams = JSON.parse(params);
         var date = new Date();
         var hour = date.getHours() + 7;
         date.setHours(hour)
         var dateStartTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00.000";
         var dateEndTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59.999";
         var getNotificationQuery = "select top 15 ID as notificationID,message, time, isRead from Notification \n" +
             "where senderID=" + clientParams.userID + " \n" +
             "and Time>='" + dateStartTime + "' and Time<='" + dateEndTime + "' \n" +
             "and Type=2 or Type=3 \n" +
             "order by Time DESC";
         var message = "";
         var notificationList = [];
         connection.request().query(getNotificationQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getNotificationQuery
             } else {
                 message = statusMessageSuccess + getNotificationQuery
                 if (typeof result != "undefined" && result.recordset.length > 0) {
                     notificationList = result.recordset;
                     notificationList.forEach(function(element) {
                         var date = new Date(element.time.toString())

                         element.hour = date.getHours() + 7; //off set to UTC +07
                         element.min = date.getMinutes();
                         element.year = date.getFullYear();
                         element.month = date.getMonth() + 1;
                         element.date = date.getDate();
                         var messageArray = element.message.split("! \n")
                         element.header = messageArray[0];
                         element.content = messageArray[1];

                     }, this);
                 }
             }
             console.log(notificationList)
             io.emit('log message', message);
             socket.emit('Mobile Get Notifications', JSON.stringify({
                 notificationList: notificationList
             }))
         })


     })


     socket.on('Web Get Notifications', (params) => {
         var clientParams = JSON.parse(params);
         var date = new Date();
         var hour = date.getHours() + 7;
         date.setHours(hour)
         var dateStartTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00.000";
         var dateEndTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59.999";
         var getNotificationQuery = "select Notification.ID as notificationID,message, time, senderID,fullname as sender, licensePlate, isRead,Tour.Name as tourName  \n" +
             "from Notification \n" +
             "inner join [user] on SenderID = [user].ID \n" +
             "inner join UserInfo on SenderID=UserInfo.UserID \n" +
             "inner join User_Coach_SeatNumber as UCSN on UCSN.UserID =SenderID \n" +
             "inner join Coach on UCSN.CoachID = Coach.ID \n" +
             "inner join TourInstance on [user].TourInstanceID=TourInstance.ID \n" +
             "inner join Tour on TourInstance.TourID = Tour.ID \n" +
             "where ReceiverID=0  \n" +
             "and Time>='" + dateStartTime + "' and Time<='" + dateEndTime + "' \n" +
             "and Type=2 or Type=3 \n";
         if (clientParams.getAll == false) {
             getNotificationQuery += "and IsRead=0 \n"
         }
         getNotificationQuery += "order by Time DESC";

         var message = "";
         var notificationList = [];
         connection.request().query(getNotificationQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getNotificationQuery
             } else {
                 message = statusMessageSuccess + getNotificationQuery
                 if (typeof result != "undefined" && result.recordset.length > 0) {
                     notificationList = result.recordset;
                 }
             }

             io.emit('log message', message);
             socket.emit('Web Get Notifications', JSON.stringify({
                 notificationList: notificationList
             }))
         })
     })

     socket.on('Mobile Get Received Notifications', (params) => {
         var clientParams = JSON.parse(params);
         var date = new Date();
         var hour = date.getHours() + 7;
         date.setHours(hour)
         var dateStartTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00.000";
         var dateEndTime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 23:59:59.999";
         var getNotificationQuery = "select Notification.ID as notificationID,message,NotificationType.name as messageType, time, senderID, \n" +
             "UserInfo.Fullname as senderName, receiverID, UI.Fullname as receiverName,isRead \n" +
             "from Notification \n" +
             "inner join UserInfo on SenderID = UserInfo.UserID \n" +
             "inner join UserInfo as UI on ReceiverID = UI.UserID \n" +
             "inner join NotificationType on Type=NotificationType.ID \n" +
             "where ReceiverID=" + clientParams.userID + " \n" +
             "and Time>='" + dateStartTime + "' and Time<='" + dateEndTime + "' \n"
         getNotificationQuery += "order by Time DESC";

         var message = "";
         var notificationList = [];
         connection.request().query(getNotificationQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getNotificationQuery
             } else {
                 message = statusMessageSuccess + getNotificationQuery
                 if (typeof result != "undefined" && result.recordset.length > 0) {
                     notificationList = result.recordset;
                 }
             }

             io.emit('log message', message);
             socket.emit('Mobile Get Received Notifications', JSON.stringify({
                 notificationList: notificationList
             }))
         })
     })

     socket.on('Read Notification', (params) => {
         var clientParams = JSON.parse(params);
         var updateNotificationQuery = "UPDATE Notification set IsRead=1 \n" +
             "where ID=" + clientParams.notificationID;
         var message = "";
         connection.request().query(updateNotificationQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateNotificationQuery
             } else {
                 message = statusMessageSuccess + updateNotificationQuery;

             }
             io.emit('log message', message);
         })
     })

     socket.on('Update Scan History', (params) => {
         var clientParams = JSON.parse(params);
         var insertScanHistoryQuery = "INSERT into ScanHistory (ScheduleID,Tourist,TourGuide,TouristStatus) \n" +
             "VALUES (" + clientParams.scheduleID + "," + clientParams.tourist + "," + clientParams.tourguide + "," + clientParams.touristStatus + ")";
         var message = "";
         connection.request().query(insertScanHistoryQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertScanHistoryQuery;
             } else {
                 message = statusMessageSuccess + insertScanHistoryQuery;
             }
             io.emit('log message', message)
                 /* var updatTouristStatusQuery = "UPDATE [user] set TouristStatus=" + clientParams.touristStatus + " \n" +
                      "where [user].id=" + clientParams.tourist;
                  message = "";
                  connection.request().query(updateTouristStatusQuery, (err, result) => {
                      if (err) {
                          message = statusMessageError + updateTouristStatusQuery
                      } else {
                          message = statusMessageSuccess + updateTouristStatusQuery
                      }
                      io.emit('log message', message)
                  }) */
         })

     })

     socket.on('Web Get Scan History', (params) => {
         var clientParams = JSON.parse(params);
         var getNotificationHistoryQuery = ""
     })

     socket.on('Get Coach Company List', (params) => {

     })
 });


 http.listen(port, () => {
     console.log('listening on *:' + port);
 });