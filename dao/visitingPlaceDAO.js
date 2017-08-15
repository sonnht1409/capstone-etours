"use strict"
const sql = require('mssql');
var dbconfig = require("../dbconfig")
var config = new dbconfig();
const connection = new sql.ConnectionPool(config.option)
const statusMessageError = "ERROR! ";
const statusMessageSuccess = "SUCCESS! ";
const statusFailed = "FAILED";
const statusSuccess = "SUCCESS"

class VisitingPlaceDAO {
    createVisitPlace(name, latitude, longitude, type, imageLink, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var insertVisitPlaceQuery = "Insert into VisitingPlace (Name,IsActive,Latitude,Longitude,Type,ImageLink) \n" +
                    "VALUES (N'" + name + "',1," + latitude + "," + longitude + "," +
                    type + ",'" + imageLink + "')";
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close()
                })
            }
        })
    }

    updateVisitPlace(name, latitude, longitude, type, id, imageLink, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close();
            } else {
                var updateVisitPlaceQuery = "update VisitingPlace set name=N'" + name + "', \n" +
                    "Latitude=" + latitude + ", \n" +
                    "Longitude=" + longitude + ", \n" +
                    "ImageLink='" + imageLink + "', \n" +
                    "Type =" + type + " \n" +
                    "where id=" + id;
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close()
                })
            }
        })
    }

    removeVisitPlace(id, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var deactiveVisitPlaceQuery = "update VisitingPlace set isActive=0 where id=" + id;
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close();
                })
            }
        })
    }

    reactiveVisitPlace(id, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close();
            } else {
                var reactiveVisitPlaceQuery = "update VisitingPlace set isActive=1 where id=" + id;
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
                    callback({
                        message: message,
                        status: status
                    })
                    connection.close();
                })
            }
        })
    }

    getAllVisitPlace(isActive, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close();
            } else {
                var getPlaceListQuery = "select VP.ID as visitPlaceID, VP.Name as visitPlaceName, VP.isActive," +
                    "Latitude,Longitude, Type as typeID, VPT.Name as typeName \n" +
                    "from VisitingPlace as VP inner join VisitingPlaceType as VPT on VP.Type=VPT.ID \n" +
                    "where VP.IsActive = " + isActive + "\n" +
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
                    callback({
                        visitingPlaceList: visitingPlaceList,
                        message: message
                    })
                    connection.close();

                })
            }
        })
    }
}

module.exports = VisitingPlaceDAO;