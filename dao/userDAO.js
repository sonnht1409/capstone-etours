 "use strict"
 const sql = require('mssql');
 var dbconfig = require("../dbconfig")
 var config = new dbconfig();

 const connection = new sql.ConnectionPool(config.option)
 const statusMessageError = "ERROR! ";
 const statusMessageSuccess = "SUCCESS! ";
 const statusFailed = "FAILED";
 const statusSuccess = "SUCCESS"


 class UserDAO {

     get loggedUser() {
         return this._loggedUser
     }
     get message() {
         return this._message;
     }
     webLogin(username, password, callback) {
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
         var loggedUser = {}
         connection.connect(err => {
             if (err) {
                 console.log("have error");
                 console.log(err)
             } else {
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

                     connection.close();
                     callback({
                         message: message,
                         loggedUser: loggedUser
                     })

                 })

             }
         })



     }

     getAllUser(isActive, callback) {
         connection.connect(err => {
             if (err) {
                 console.log(err)
                 connection.close()
             } else {
                 var message = "";
                 var userList = []
                 var getAllUserQuery = "select [user].id as userID, username, [user].isActive, roleID, \n" +
                     "role, fullname, phoneNumber,email \n" +
                     "from [user] \n" +
                     "inner join UserInfo on [user].id = UserInfo.UserID \n" +
                     "inner join Role on Role.ID = [user].RoleID \n" +
                     "where [user].isActive =" + isActive + " \n" +
                     "order by RoleID"
                 connection.request().query(getAllUserQuery, (err, result) => {
                     if (err) {
                         message = statusMessageError + getAllUserQuery
                     } else {
                         message = statusMessageSuccess + getAllUserQuery
                         if (typeof result !== "undefined" && result.recordset.length > 0) {
                             userList = result.recordset
                         }
                     }
                     callback({
                         userList: userList,
                         message: message
                     })
                 })
             }
         })
     }

     getUserById(id, callback) {

         connection.connect(err => {
             if (err) {
                 console.log(err)
                 connection.close()
             } else {
                 var message = "";
                 var user = {}
                 var getUserQuery = "select [user].id as userID, username, [user].isActive, roleID, \n" +
                     "role, fullname, phoneNumber,email, userIdNumber, gender, birthday, address, \n" +
                     "tourInstanceID,tourID,Tour.name as tourName \n" +
                     "from [user]  \n" +
                     "inner join UserInfo on [user].id = UserInfo.UserID \n" +
                     "inner join Role on Role.ID = [user].RoleID \n" +
                     "left join TouristStatus on [user].TouristStatus = TouristStatus.ID \n" +
                     "left join TourGuideStatus on [user].TourGuideStatus = TourGuideStatus.ID \n" +
                     "inner join TourInstance on TourInstance.ID =[user].tourInstanceID \n" +
                     "inner join Tour on Tour.ID = TourInstance.TourID \n" +
                     "where [user].id=" + id;
                 connection.request().query(getUserQuery, (err, result) => {
                     if (err) {
                         message = statusMessageError + getUserQuery
                     } else {
                         message = statusMessageSuccess + getUserQuery
                         if (typeof result !== "undefined" && result.recordset.length > 0) {
                             user = result.recordset[0]
                         }
                     }
                     callback({
                         user: user,
                         message: message
                     })
                 })
             }
         })
     }

     createUser(user, userInfo, callback) {
         connection.connect(err => {
             if (err) {
                 console.log(err)
                 connection.close()
             } else {
                 var message = "";
                 var status = "";
                 var createUserQuery = "INSERT INTO [USER] (username,password,roleID,isActive) VALUES \n" +
                     "('" + user.username + "','" + user.password + "'," + user.roleId + ",1)";
                 connection.request().query(createUserQuery, (err, result) => {
                     if (err) {
                         message = statusMessageError + createUserQuery
                         status = statusFailed
                     } else {
                         message = statusSuccess + createUserQuery
                         status = statusSuccess;
                     }
                     var getNewestUserQuery = "Select top 1 ID from [User] order by ID DESC";
                     var newestUser = {};
                     connection.request().query(getNewestUserQuery, (err, result) => {
                         if (err) {
                             message += "\n " + statusMessageError + getNewestUserQuery
                             status = statusFailed
                         } else {
                             message += "\n " + statusMessageSuccess + getNewestUserQuery
                             status = statusSuccess
                             newestUser = result.recordset[0];
                         }
                         var insertUserInfoQuery = "INSERT INTO UserInfo (fullname,birthday,userIdNumber,gender,phoneNumber,userID,email,address) \n" +
                             "VALUES (N'" + userInfo.fullname + "','" + userInfo.birthday + "','" + userInfo.userIdNumber + "'," + userInfo.gender + ",'" +
                             userInfo.phoneNumber + "'," + newestUser.ID + ",'" + userInfo.email + "','" + userInfo.address + "')";
                         connection.request().query(insertUserInfoQuery, (err, result) => {
                             if (err) {
                                 message += "\n " + statusMessageError + insertUserInfoQuery;
                                 status = statusFailed;
                             } else {
                                 message += "\n " + statusMessageSuccess + insertUserInfoQuery;
                                 status = statusSuccess
                             }
                             callback({
                                 message: message,
                                 status: status
                             })
                         })
                     })
                 })

             }
         })
     }

 }

 module.exports = UserDAO