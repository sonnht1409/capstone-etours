"use strict"
const sql = require('mssql');
var dbconfig = require("../dbconfig")
var config = new dbconfig();
const connection = new sql.ConnectionPool(config.option)
const statusMessageError = "ERROR! ";
const statusMessageSuccess = "SUCCESS! ";
const statusFailed = "FAILED";
const statusSuccess = "SUCCESS"

class PlaceDAO {
    createPlace(name, callback) {
        var insertPlaceQuery = "Insert into Place (Name,IsActive) VALUES (N'" + name + "',1)";
        var message = "";
        var status = "";
        connection.connect(err => {
            if (err) {
                console.log("have error");
                console.log(err)
                connection.close();
            } else {
                connection.request().query(insertPlaceQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + insertPlaceQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + insertPlaceQuery;
                        status = statusSuccess
                    }
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close();
                })

            }
        })

    }

    getAllPlace(isActive, callback) {
        var getPlaceListQuery = "select * from Place where IsActive=" + isActive;
        var message = "";
        var data = {
            placeList: [],
            message: message
        };
        connection.connect(err => {
            if (err) {
                console.log("have error")
                console.log(err)
                connection.close();
            } else {
                connection.request().query(getPlaceListQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + getPlaceListQuery
                    } else {
                        message = statusMessageSuccess + getPlaceListQuery;
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            data.placeList = result.recordset;
                        }
                    }
                    data.message = message;
                    callback(data)
                    connection.close();

                })
            }
        })
    }
    updatePlace(placeID, placeName, callback) {
        connection.connect(err => {
            if (err) {
                console.log("have error")
                console.log(err)
                connection.close()
            } else {
                var updatePlaceQuery = "update Place set name=N'" + placeName + "' \n" +
                    "where id=" + placeID;
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close()
                })
            }
        })
    }

    removePlace(placeID, callback) {
        connection.connect(err => {
            if (err) {
                connsole.log("have error")
                console.log(err)
                connection.close()
            } else {
                var deactivePlaceQuery = "update Place set isActive=0 where id=" + placeID;
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

                    callback({
                        message: message,
                        status: status
                    })
                    connection.close()
                })
            }
        })
    }

    reactivePlace(placeID, callback) {
        connection.connect(err => {
            if (err) {

            } else {
                var reactivePlaceQuery = "update Place set isActive=1 where id=" + placeID;
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close()

                })
            }
        })
    }
}

module.exports = PlaceDAO;