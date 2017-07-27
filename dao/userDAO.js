 "use strict"
 const sql = require('mssql');
 const connection = new sql.ConnectionPool({
     user: 'etours',
     password: "$Son01627335534",
     server: "etours2.database.windows.net",
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

 }

 module.exports = UserDAO