 "use strict"
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
         var UserDAO = require("./dao/userDAO")
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
             "select fullname,PhoneNumber,Email,Address, CoachID, Coach.LicensePlate, [user].TourInstanceID, [user].id as UserID, role.ID as RoleID, role" +
             ", [user].IsActive as UserActive, role.IsActive as RoleActive, \n " +
             "Tour.Name as TourName, TourInstance.StartTime,TourInstance.EndTime \n" +
             "from [user] \n " +
             "inner join UserInfo on [user].ID = UserInfo.UserID \n " +
             "inner join Role on [user].RoleID = Role.ID \n " +
             "inner join User_Coach_SeatNumber as UCSN on [user].id = UCSN.UserID \n" +
             "inner join Coach on UCSN.CoachID=Coach.ID \n" +
             "inner join TourInstance on [user].TourInstanceID=TourInstance.ID \n" +
             "inner join Tour on TourInstance.TourID=Tour.ID \n" +
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
             "VisitingPlace.Name as VisitPlaceName,Schedule.Status,TourTime, Latitude,Longitude, TourInstanceDetailId \n" +
             "from Schedule inner join TourInstanceDetail as TID on Schedule.TourInstanceDetailId=TID.id \n" +
             "inner join TourInstance on TID.TourInstanceID = TourInstance.ID \n" +
             "inner join TourInstanceStatus as TIS on TourInstance.Status = TIS.ID \n" +
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
             "select fullname,PhoneNumber,Email,Address, CoachID, [user].TourInstanceID, [user].id as UserID, role.ID as RoleID, role" +
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
         }, function() {
             socket.emit('Reschedule Time', JSON.stringify({
                 status: "COMPLETED"
             }))
         });

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
         var insertNotificationQuery = "";
         if (clientParams.type == 2) {
             header = "Yêu cầu thay đổi lộ trình! \n"
             var notification = "Thay đổi lộ trình của xe " + clientParams.licensePlate + ", từ " + clientParams.startPlaceName +
                 " đến " + clientParams.destinationName;
             insertNotificationQuery = "INSERT INTO Notification (Message,Type,SenderID,ReceiverID) \n" +
                 "VALUES (N'" + header + notification + "'," + clientParams.type + "," + clientParams.userID + ",0)";

         }
         if (clientParams.type == 3) {
             header = "Thông báo sự cố! \n"
             insertNotificationQuery = "INSERT INTO Notification (Message,Type,SenderID,ReceiverID) \n" +
                 "VALUES(N'" + header + clientParams.message + "'," + clientParams.type + "," + clientParams.userID + ",0)";
         }
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
         var getNotificationQuery = "select top 15 ID as notificationID,message, time, isRead, isAccept from Notification \n" +
             "where senderID=" + clientParams.userID + " \n" +
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


     socket.on('Web Get Scan History', (params) => {
         var clientParams = JSON.parse(params);
         var getNotificationHistoryQuery = ""
     })

     socket.on('Get Coach Company List', (params) => {
         var clientParams = JSON.parse(params);
         var getCoachCompanyQuery = "select * from CoachCompany where isActive=" + clientParams.isActive;
         var message = "";
         var coachCompanyList = [];
         connection.request().query(getCoachCompanyQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getCoachCompanyQuery
             } else {
                 message = statusMessageSuccess + getCoachCompanyQuery
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     coachCompanyList = result.recordset;
                 }
             }

             io.emit('log message', message);
             socket.emit('Get Coach Company List', JSON.stringify({
                 coachCompanyList: coachCompanyList
             }))
         })
     })

     socket.on('Create Coach Company', (params) => {
         var clientParams = JSON.parse(params);
         var insertCoachCompanyQuery = "INSERT into CoachCompany (Name,IsActive) \n" +
             "VALUES (N'" + clientParams.name + "',1)";
         var message = "";
         var status = "";
         connection.request().query(insertCoachCompanyQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertCoachCompanyQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + insertCoachCompanyQuery;
                 status = statusSuccess
             }
             io.emit('log message', message)
             socket.emit('Create Coach Company', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Update Coach Company', (params) => {
         var clientParams = JSON.parse(params);
         var updateCoachCompanyQuery = "UPDATE CoachCompany set name=N'" + clientParams.name + "' \n" +
             "where id=" + clientParams.coachCompanyID;
         var message = "";
         var status = "";
         connection.request().query(updateCoachCompanyQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateCoachCompanyQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateCoachCompanyQuery
                 status = statusSuccess
             }
             io.emit('log message', message)
             socket.emit('Update Coach Company', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Coach Company', (params) => {
         var clientParams = JSON.parse(params);
         var removeCoachCompanyQuery = "UPDATE CoachCompany set IsActive=0 \n" +
             "where id=" + clientParams.coachCompanyID;
         var message = "";
         var status = "";
         connection.request().query(removeCoachCompanyQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeCoachCompanyQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeCoachCompanyQuery
                 status = statusSuccess
             }

             io.emit('log message', message)
             socket.emit('Remove Coach Company', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Coach Company', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveCoachCompanyQuery = "UPDATE CoachCompany set IsACtive=1 \n" +
             "where id=" + clientParams.coachCompanyID;
         var message = "";
         var status = "";
         connection.request().query(reactiveCoachCompanyQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveCoachCompanyQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveCoachCompanyQuery
                 status = statusSuccess
             }
             io.emit('log message', message)
             socket.emit('Reactive Coach Company', JSON.stringify({
                 status: status
             }))
         })
     })


     socket.on('Create Tour', (params) => {
         var clientParams = JSON.parse(params);
         var insertTourQuery = "INSERT INTO Tour (Name,StartPlace,Destination,Duration,Description,IsActive) \n" +
             "VALUES (N'" + clientParams.name + "'," + clientParams.startPlaceID + "," + clientParams.destinationID + ",N'" + clientParams.duration + "'," +
             "N'" + clientParams.description + "',1)";
         console.log(insertTourQuery)
         var message = "";
         var status = "";
         connection.request().query(insertTourQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + insertTourQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + insertTourQuery;
                 status = statusSuccess
             }
             io.emit('log message', message)
             var message = "";
             var tourID
             var selectInsertedTour = "select top 1 ID from Tour order by ID DESC";
             connection.request().query(selectInsertedTour, (err, result) => {
                 if (err) {
                     message = statusMessageError + selectInsertedTour;
                 } else {
                     message = statusMessageSuccess + selectInsertedTour;
                     tourID = result.recordset[0].ID;
                 }
                 socket.emit('Create Tour', JSON.stringify({
                     status: status,
                     tourID: tourID
                 }))
             })


         })
     })

     socket.on('Update Tour', (params) => {
         var clientParams = JSON.parse(params);
         var updateTourQuery = "UPDATE Tour set \n" +
             "Name=N'" + clientParams.name + "', \n" +
             "StartPlace=" + clientParams.startPlaceID + ", \n" +
             "Destination=" + clientParams.destinationID + ",\n" +
             "Duration=N'" + clientParams.duration + "', \n" +
             "Description=N'" + clientParams.description + "' \n" +
             "where ID=" + clientParams.tourID;
         var message = "";
         var status = "";
         connection.request().query(updateTourQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateTourQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateTourQuery
                 status = statusSuccess
             }
             io.emit('log message', message)
             socket.emit('Update Tour', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Tour', (params) => {
         var clientParams = JSON.parse(params);
         var removeTourQuery = "UPDATE Tour set IsActive=0 where ID=" + clientParams.tourID;
         var message = "";
         var status = "";
         connection.request().query(removeTourQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeTourQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeTourQuery
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Remove Tour', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Tour', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveTourQuery = "UPDATE Tour set IsActive=1 where ID=" + clientParams.tourID;
         var message = "";
         var status = "";
         connection.request().query(reactiveTourQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveTourQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveTourQuery
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Reactive Tour', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Get Tour List', (params) => {
         var clientParams = JSON.parse(params);
         var getTourListQuery = "select Tour.ID as tourID, Tour.Name as tourName, Tour.StartPlace as startPlaceID, \n" +
             "StartPlace.Name as startPlaceName, Tour.Destination as destinationID, Destination.Name as destinationName, \n" +
             "Tour.Duration as duration, Tour.Description as description \n" +
             "from Tour \n" +
             "inner join Place as StartPlace on Tour.StartPlace = StartPlace.ID \n" +
             "inner join Place as Destination on Tour.Destination = Destination.ID \n" +
             "where Tour.IsActive=" + clientParams.isActive;
         var message = "";
         var tourList = [];
         connection.request().query(getTourListQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTourListQuery;
             } else {
                 message = statusMessageSuccess + getTourListQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     tourList = result.recordset;
                 }

             }
             io.emit('log message', message);
             socket.emit('Get Tour List', JSON.stringify({
                 tourList: tourList
             }))
         })
     })

     var searchAndActionBySchedule = (scanDataList, index, userID, callback) => {

         if (index == scanDataList.length) {
             callback();
             return;
         }
         var message = "";
         var actionQuery = "UPDATE ScanHistory set \n" +
             "OnTotal=N'" + scanDataList[index].numberPerTotal + "', \n" +
             "TouristOff=N'" + scanDataList[index].listTouristOff + "', \n" +
             "Note=N'" + scanDataList[index].note + "' \n" +
             "Where ScheduleID=" + scanDataList[index].scheduleID + " and UserID=" + userID;
         connection.request().query(actionQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + actionQuery;
                 io.emit('log message', message);
             } else {
                 message = statusMessageSuccess + actionQuery;
                 io.emit('log message', message);
             }
             message = "";
             var updateScheduleStatusQuery = "UPDATE Schedule set Status=" + scanDataList[index].status + " \n" +
                 "where ID=" + scanDataList[index].scheduleID;
             connection.request().query(updateScheduleStatusQuery, (err, result) => {
                 if (err) {
                     message = statusMessageError + updateScheduleStatusQuery;
                     io.emit('log message', message);
                 } else {
                     message = statusMessageSuccess + updateScheduleStatusQuery;
                     io.emit('log message', message);
                 }
                 searchAndActionBySchedule(scanDataList, index + 1, userID, callback)
             })

         })
     }
     socket.on('Update Mobile Schedule', (params) => {
         var clientParams = JSON.parse(params);
         var scanDataList = clientParams.scanDataList;
         var userID = clientParams.userID
         searchAndActionBySchedule(scanDataList, 0, userID, () => {
             socket.emit('Update Mobile Schedule', JSON.stringify({
                 status: "COMPLETED"
             }))
         })

     })

     socket.on('Get Scan History', (params) => {
         var clientParams = JSON.parse(params);
         var getScanHistoryQuery = "select ScheduleID,OnTotal,TouristOff,Note,UserID,Status, StartTime, EndTime,VisitingPlaceID,VisitingPlace.Name as VisitingPlaceName \n" +
             "from ScanHistory \n" +
             "inner join Schedule on Schedule.ID = ScanHistory.ScheduleID \n" +
             "inner join TourInstanceDetail on TourInstanceDetail.ID=Schedule.TourInstanceDetailID \n" +
             "inner join VisitingPlace on Schedule.VisitingPlaceID=VisitingPlace.ID \n" +
             "where TourInstanceID=" + clientParams.tourInstanceID + " and UserID=" + clientParams.userID + " \n" +
             "order by StartTime, EndTime"
         var message = "";
         var scanHistoryList = [];
         connection.request().query(getScanHistoryQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getScanHistoryQuery
             } else {
                 message = statusMessageSuccess + getScanHistoryQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     scanHistoryList = result.recordset;
                 }
             }
             io.emit('log message', message)
             socket.emit('Get Scan History', JSON.stringify({
                 scanHistoryList: scanHistoryList
             }))
         })
     })

     socket.on('Update Visit Place Order', (params) => {
         var clientParams = JSON.parse(params);
         var visitPlaceOrderList = clientParams.visitPlaceOrderList;
         var removeOldOrderQuery = "DELETE FROM Tour_VisitingPlace where TourID=" + clientParams.tourID;
         var message = "";


         connection.request().query(removeOldOrderQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeOldOrderQuery
             } else {
                 message = statusMessageSuccess + removeOldOrderQuery;
             }
             io.emit('log message', message);

             visitPlaceOrderList.forEach(function(element, index) {
                 message = "";
                 var insertVisitPlaceOrderQuery = "INSERT INTO Tour_VisitingPlace (TourID,VisitingPlaceID,Priority) \n" +
                     "VALUES (" + clientParams.tourID + "," + element.visitPlaceID + "," + element.priority + ")";
                 connection.request().query(insertVisitPlaceOrderQuery, (err, result) => {
                     if (err) {
                         message = statusMessageError + insertVisitPlaceOrderQuery
                     } else {
                         message = statusMessageSuccess + insertVisitPlaceOrderQuery;
                     }
                     io.emit('log message', message);
                 })
             }, function() {
                 socket.emit('Update Visit Place Order', JSON.stringify({
                     status: "COMPLETED"
                 }))
             });
         })

     })

     socket.on('Get Visit Place Order', (params) => {
         var clientParams = JSON.parse(params);
         var getVisitPlaceOrder = "select * from Tour_VisitingPlace \n" +
             "where tourID=" + clientParams.tourID + " \n" +
             "order by priority";
         var message = "";
         var visitPlaceOrderList = [];
         connection.request().query(getVisitPlaceOrder, (err, result) => {
             if (err) {
                 message = statusMessageError + getVisitPlaceOrder;
             } else {
                 message = statusMessageSuccess + getVisitPlaceOrder;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     visitPlaceOrderList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Visit Place Order', JSON.stringify({
                 visitPlaceOrderList: visitPlaceOrderList
             }))
         })
     })

     socket.on('Remove Visit Order List', (params) => {
         var clientParams = JSON.parse(params);
         var removeOldOrderQuery = "DELETE FROM Tour_VisitingPlace where TourID=" + clientParams.tourID;
         var message = "";
         var status = "";

         connection.request().query(removeOldOrderQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeOldOrderQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeOldOrderQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Remove Visit Order List', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Mobile Update Tourist Status', (params) => {
         var clientParams = JSON.parse(params);
         var touristStatusList = clientParams.touristStatusList;
         touristStatusList.forEach(function(element) {
             var message = "";
             var updateStatusQuery = "UPDATE [user] set TouristStatus =" + element.touristStatus + " \n" +
                 "where ID=" + element.userID;
             connection.request().query(updateStatusQuery, (err, result) => {
                 if (err) {
                     message = statusMessageError + updateStatusQuery;
                 } else {
                     message = statusMessageSuccess + updateStatusQuery;
                 }
                 io.emit('log message', message)
             })
         }, () => {
             socket.emit('Mobile Update Tourist Status', JSON.stringify({
                 status: "COMPLETED"
             }))
         });
     })

     socket.on('Web Response Notification', (params) => {
         var clientParams = JSON.parse(params);
         var responseNotificationQuery = "UPDATE Notification set IsAccept=" + clientParams.isAccept + " \n" +
             "where ID=" + clientParams.notificationID;
         var message = "";
         connection.request().query(responseNotificationQuery, (err, result) => {
             if (err) {
                 message = "";
             } else {
                 message = "";
             }
             io.emit('log message', message);
             //push notification later
         })
     })

     socket.on('Create Tourist Status', (params) => {
         var clientParams = JSON.parse(params);
         var createTouristStatusQuery = "INSERT into TouristStatus (Status,IsActive) VALUES \n" +
             "(N'" + clientParams.status + "',1)";
         var message = "";
         var status = "";
         connection.request().query(createTouristStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + createTouristStatusQuery;
                 status = statusFailed;
             } else {
                 message = statusMessageSuccess + createTouristStatusQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Create Tourist Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Get Tourist Status List', (params) => {
         var clientParams = JSON.parse(params)
         var getTouristStatusQuery = "Select * from TouristStatus where IsActive=" + clientParams.isActive;
         var message = "";
         var touristStatusList = [];
         connection.request().query(getTouristStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTouristStatusQuery;
             } else {
                 message = statusMessageSuccess + getTouristStatusQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     touristStatusList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Tourist Status List', JSON.stringify({
                 touristStatusList: touristStatusList
             }))
         })
     })

     socket.on('Update Tourist Status', (params) => {
         var clientParams = JSON.parse(params);
         var updateTouristStatusQuery = "UPDATE TouristStatus set Status =N'" + clientParams.status + "' \n" +
             "where ID=" + clientParams.touristStatusID;
         var message = "";
         var status = "";
         connection.request().query(updateTouristStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateTouristStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateTouristStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Update Tourist Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Tourist Status', (params) => {
         var clientParams = JSON.parse(params);
         var removeTouristStatusQuery = "UPDATE TouristStatus set IsActive=0 \n" +
             "where ID=" + clientParams.touristStatusID;
         var message = "";
         var status = "";
         connection.request().query(removeTouristStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeTouristStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeTouristStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Remove Tourist Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Tourist Status', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveTouristStatusQuery = "UPDATE TouristStatus set IsActive=1 \n" +
             "where ID=" + clientParams.touristStatusID;
         var message = "";
         var status = "";
         connection.request().query(reactiveTouristStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveTouristStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveTouristStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Reactive Tourist Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Create Tour Guide Status', (params) => {
         var clientParams = JSON.parse(params);
         var createTourGuideStatusQuery = "INSERT into TourGuideStatus (Status,IsActive) VALUES \n" +
             "(N'" + clientParams.status + "',1)";
         var message = "";
         var status = "";
         connection.request().query(createTourGuideStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + createTourGuideStatusQuery;
                 status = statusFailed;
             } else {
                 message = statusMessageSuccess + createTourGuideStatusQuery;;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Create Tour Guide Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Get Tour Guide Status List', (params) => {
         var clientParams = JSON.parse(params)
         var getTourGuideStatusQuery = "Select * from TourGuideStatus where IsActive=" + clientParams.isActive;
         var message = "";
         var tourGuideStatusList = [];
         connection.request().query(getTourGuideStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTourGuideStatusQuery;
             } else {
                 message = statusMessageSuccess + getTourGuideStatusQuery;
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     tourGuideStatusList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Tour Guide Status List', JSON.stringify({
                 tourGuideStatusList: tourGuideStatusList
             }))
         })
     })

     socket.on('Update Tour Guide Status', (params) => {
         var clientParams = JSON.parse(params);
         var updateTourGuideStatusQuery = "UPDATE TourGuideStatus set Status =N'" + clientParams.status + "' \n" +
             "where ID=" + clientParams.tourGuideStatusID;
         var message = "";
         var status = "";
         connection.request().query(updateTourGuideStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateTourGuideStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateTourGuideStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Update Tour Guide Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Tour Guide Status', (params) => {
         var clientParams = JSON.parse(params);
         var removeTourGuideStatusQuery = "UPDATE TourGuideStatus set IsActive=0 \n" +
             "where ID=" + clientParams.tourGuideStatusID;
         var message = "";
         var status = "";
         connection.request().query(removeTourGuideStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeTourGuideStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeTourGuideStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Remove Tour Guide Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Tour Guide Status', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveTourGuideStatusQuery = "UPDATE TourGuideStatus set IsActive=1 \n" +
             "where ID=" + clientParams.tourGuideStatusID;
         var message = "";
         var status = "";
         connection.request().query(reactiveTourGuideStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveTourGuideStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveTourGuideStatusQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Reactive Tour Guide Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Get Tour Instance Status List', (params) => {
         var clientParams = JSON.parse(params);
         var getTourInstanceStatusQuery = "Select * from TourInstanceStatus where IsActive=" + clientParams.isActive;
         var tourInstanceStatusList = [];
         var message = "";
         connection.request().query(getTourInstanceStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTourInstanceStatusQuery
             } else {
                 message = statusMessageSuccess + getTourInstanceStatusQuery
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     tourInstanceStatusList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Tour Instance Status List', JSON.stringify({
                 tourInstanceStatusList: tourInstanceStatusList
             }))
         })
     })

     socket.on('Create Tour Instance Status', (params) => {
         var clientParams = JSON.parse(params);
         var createTourInstanceStatus = "INSERT INTO TourInstanceStatus (Status,IsActive) VALUES \n" +
             "(N'" + clientParams.status + "',1)";
         var message = "";
         var status = "";
         connection.request().query(createTourInstanceStatus, (err, result) => {
             if (err) {
                 message = statusMessageError + createTourInstanceStatus;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + createTourInstanceStatus;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Create Tour Instance Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Update Tour Instance Status', (params) => {
         var clientParams = JSON.parse(params);
         var updateTourInstanceStatus = "UPDATE TourInstanceStatus set Status=N'" + clientParams.status + "' \n" +
             "where ID=" + clientParams.tourInstanceStatusID;
         var message = "";
         var status = "";
         connection.request().query(updateTourInstanceStatus, (err, result) => {
             if (err) {
                 message = statusMessageError + updateTourInstanceStatus
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateTourInstanceStatus
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Update Tour Instance Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Remove Tour Instance Status', (params) => {
         var clientParams = JSON.parse(params);
         var removeTourInstanceStatusQuery = "UPDATE TourInstanceStatus set IsActive=0 \n" +
             "where ID=" + clientParams.tourInstanceStatusID;
         var message = "";
         var status = "";
         connection.request().query(removeTourInstanceStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeTourInstanceStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeTourInstanceStatusQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Remove Tour Instance Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Tour Instance Status', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveTourInstanceStatusQuery = "UPDATE TourInstanceStatus set IsActive=1 \n" +
             "where ID=" + clientParams.tourInstanceStatusID;
         var message = "";
         var status = "";
         connection.request().query(reactiveTourInstanceStatusQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveTourInstanceStatusQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveTourInstanceStatusQuery;
                 status = statusSuccess;
             }
             io.emit('log message', message);
             socket.emit('Reactive Tour Instance Status', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Get Tour Instance List', (params) => {
         var clientParams = JSON.parse(params);
         var getTourInstanceQuery = "select Tour.ID as TourID, Tour.Name as TourName, TourInstance.ID as TourInstanceID, \n" +
             "StartTime, EndTime, Duration \n" +
             "from TourInstance \n" +
             "inner join Tour on TourID = TourID \n" +
             "inner join TourInstanceStatus on TourInstance.Status=TourInstanceStatus.ID \n" +
             "where Tour.ID=" + clientParams.tourID + " and TourInstance.Status=" + clientParams.tourInstanceStatus +
             " and TourInstance.IsActive=" + clientParams.isActive + "\n" +
             "order by StartTime, EndTime"
         var message = ""
         var tourInstanceList = [];
         connection.request().query(getTourInstanceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + getTourInstanceQuery
             } else {
                 message = statusMessageSuccess + getTourInstanceQuery
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     tourInstanceList = result.recordset;
                 }
             }
             io.emit('log message', message);
             socket.emit('Get Tour Instance List', JSON.stringify({
                 tourInstanceList: tourInstanceList
             }))
         })
     })

     socket.on('Create Tour Instance', (params) => {
         var clientParams = JSON.parse(params);
         var startDate = new Date(clientParams.startDate);
         var endDate = new Date(clientParams.endDate);
         var startTime = startDate.getUTCFullYear() + "-" + (startDate.getUTCMonth() + 1) + "-" + startDate.getUTCDate() + " " +
             startDate.getUTCHours() + ":" + startDate.getUTCMinutes() + ":00.000";

         var endTime = endDate.getUTCFullYear() + "-" + (endDate.getUTCMonth() + 1) + "-" + endDate.getUTCDate() + " " +
             endDate.getUTCHours() + ":" + endDate.getUTCMinutes() + ":00.000";

         var createTourInstanceQuery = "INSERT INTO TourInstance (StartTime,EndTime,IsActive,TourID,Status) \n" +
             "VALUES ('" + startTime + "','" + endTime + "',1," + clientParams.tourID + ",1)";
         var message = "";
         var status = "";
         connection.request().query(createTourInstanceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + createTourInstanceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + createTourInstanceQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Create Tour Instance', JSON.stringify({
                 status: status
             }))
         })

     })

     socket.on('Update Tour Instance', (params) => {
         var clientParams = JSON.parse(params);
         var startDate = new Date(clientParams.startDate);
         var endDate = new Date(clientParams.endDate);
         var startTime = startDate.getUTCFullYear() + "-" + (startDate.getUTCMonth() + 1) + "-" + startDate.getUTCDate() + " " +
             startDate.getUTCHours() + ":" + startDate.getUTCMinutes() + ":00.000";

         var endTime = endDate.getUTCFullYear() + "-" + (endDate.getUTCMonth() + 1) + "-" + endDate.getUTCDate() + " " +
             endDate.getUTCHours() + ":" + endDate.getUTCMinutes() + ":00.000";

         var updateTourInstanceQuery = "UPDATE TourInstance set \n" +
             "StartTime='" + startTime + "', \n" +
             "EndTime='" + endTime + "', \n" +
             "TourID=" + clientParams.tourID + ", \n" +
             "Status=" + clientParams.tourInstanceStatus + " \n" +
             "where ID=" + clientParams.tourInstanceID;
         var message = "";
         var status = "";
         connection.request().query(updateTourInstanceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + updateTourInstanceQuery;
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + updateTourInstanceQuery;
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Update Tour Instance', JSON.stringify({
                 status: status
             }))
         })

     })

     socket.on('Remove Tour Instance', (params) => {
         var clientParams = JSON.parse(params);
         var removeTourInstanceQuery = "UPDATE TourInstance set IsActive=0 where ID=" + clientParams.tourInstanceID;
         var message = "";
         var status = "";
         connection.request().query(removeTourInstanceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + removeTourInstanceQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + removeTourInstanceQuery
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Remove Tour Instance', JSON.stringify({
                 status: status
             }))
         })
     })

     socket.on('Reactive Tour Instance', (params) => {
         var clientParams = JSON.parse(params);
         var reactiveTourInstanceQuery = "UPDATE TourInstance set IsActive=1 where ID=" + clientParams.tourInstanceID;
         var message = "";
         var status = "";
         connection.request().query(reactiveTourInstanceQuery, (err, result) => {
             if (err) {
                 message = statusMessageError + reactiveTourInstanceQuery
                 status = statusFailed
             } else {
                 message = statusMessageSuccess + reactiveTourInstanceQuery
                 status = statusSuccess
             }
             io.emit('log message', message);
             socket.emit('Reactive Tour Instance', JSON.stringify({
                 status: status
             }))
         })
     })


     socket.on('Tour Guide Get My Tour List', (params) => {
         var clientParams = JSON.parse(params);
         var getMyTourListQuery = "select distinct Tour.Name as TourName,TourInstance.ID as TourInstanceID, \n" +
             "TourInstance.StartTime, TourInstance.EndTime, LicensePlate, \n" +
             "TourInstanceStatus.Status \n" +
             "from [User] \n" +
             "inner join ScanHistory on [User].ID= ScanHistory.UserID \n" +
             "inner join Schedule on ScanHistory.ScheduleID= Schedule.ID \n" +
             "inner join TourInstanceDetail on Schedule.TourInstanceDetailId= TourInstanceDetail.ID \n" +
             "inner join TourInstance on TourInstanceDetail.TourInstanceID = TourInstance.ID \n" +
             "inner join Tour on Tour.ID = TourInstance.TourID \n" +
             "inner join Coach on Coach.ID = ScanHistory.CoachID \n" +
             "inner join TourInstanceStatus on TourInstance.Status = TourInstanceStatus.ID \n" +
             "where [User].ID=" + clientParams.userID + " \n" +
             "order by TourInstance.StartTime,TourInstance.EndTime";

         var myTourList = [];
         connection.request().query(getMyTourListQuery, (err, result) => {
             if (err) {
                 socket.emit('log message', statusMessageError + getMyTourListQuery)
             } else {
                 socket.emit('log message', statusMessageSuccess + getMyTourListQuery);
                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                     var tourList = result.recordset;
                     tourList.forEach(function(element, index) {
                         var getTotalTouristQuery = "select count([User].ID) as TotalTourist \n" +
                             "from TourInstance  \n" +
                             "inner join [User] on TourInstance.ID = [User].TourInstanceID \n" +
                             "Where [User].RoleID =3 and TourInstanceID=" + element.TourInstanceID;
                         var TotalTourist = 0;
                         var getTotalVisitPlaceQuery = "select count(VisitingPlaceID) as TotalVisitPlace \n" +
                             "from TourInstance \n" +
                             "inner join Tour on TourInstance.TourID = Tour.ID \n" +
                             "inner join Tour_VisitingPlace on Tour.ID= Tour_VisitingPlace.TourID \n" +
                             "where TourInstance.ID=" + element.TourInstanceID;
                         var TotalVisitPlace = 0;
                         connection.request().query(getTotalTouristQuery, (err, result) => {
                             if (err) {
                                 socket.emit('log message', statusMessageError + getTotalTouristQuery)
                             } else {
                                 socket.emit('log message', statusMessageSuccess + getTotalTouristQuery)
                                 if (typeof result !== "undefined" && result.recordset.length > 0) {
                                     TotalTourist = result.recordset[0].TotalTourist
                                     element.TotalTourist = TotalTourist;
                                 }
                             }
                             connection.request().query(getTotalVisitPlaceQuery, (err, result) => {
                                 if (err) {
                                     socket.emit('log message', statusMessageError + getTotalVisitPlaceQuery)
                                 } else {
                                     socket.emit('log message', statusMessageSuccess + getTotalVisitPlaceQuery)
                                     if (typeof result !== "undefined" && result.recordset.length > 0) {
                                         TotalVisitPlace = result.recordset[0].TotalVisitPlace
                                         element.TotalVisitPlace = TotalVisitPlace;
                                     }
                                     myTourList.push(element)
                                     if (index == tourList.length - 1) {
                                         socket.emit('Tour Guide Get My Tour List', JSON.stringify({
                                             myTourList: myTourList
                                         }))
                                     }
                                 }
                             })
                         })




                     }, this);
                 }
             }
         })
     })

     socket.on('Mobile Start The Tour', (params) => {

     })

     socket.on('Get Coach List', (params) => {
         var clientParams = JSON.parse(params);
         var getCoachQuery = "";
     })
 })






 http.listen(port, () => {
     console.log('listening on *:' + port);
 });