"use strict"
const sql = require('mssql');
var dbconfig = require("../dbconfig")
var config = new dbconfig();
const connection = new sql.ConnectionPool(config.option)
const statusMessageError = "ERROR! ";
const statusMessageSuccess = "SUCCESS! ";
const statusFailed = "FAILED";
const statusSuccess = "SUCCESS"

class CoachDAO {
    getAllCoach(isActive, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var message = "";
                var coachList = [];
                var getAllCoachQuery = "select coach.ID as coachID,licensePlate, \n" +
                    "numberOfSeat,Coach.isActive,coachCompanyID, coachCompany.name as coachCompanyName,tourInstanceID \n" +
                    "from Coach \n" +
                    "inner join CoachCompany on Coach.CoachCompanyID = CoachCompany.ID \n" +
                    "where Coach.isActive=" + isActive
                connection.request().query(getAllCoachQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + getAllCoachQuery
                    } else {
                        message = statusMessageSuccess + getAllCoachQuery
                        if (typeof result !== "undefined" && result.recordset.length > 0) {
                            coachList = result.recordset
                        }
                    }
                    callback({
                        coachList: coachList,
                        message: message
                    })
                    connection.close();
                })
            }
        })
    }

    createCoach(licensePlate, numberOfSeat, coachCompanyID, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err);
                connection.close()
            } else {
                var message = "";
                var status = "";
                var createCoachQuery = "INSERT into Coach (licensePlate,numberOfSeat,coachCompanyID,isActive) \n" +
                    "VALUES ('" + licensePlate + "'," + numberOfSeat + "," + coachCompanyID + ",1)"
                connection.request().query(createCoachQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + createCoachQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + createCoachQuery
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

    updateCoach(id, licensePlate, numberOfSeat, coachCompanyID, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err);
                connection.close();
            } else {
                var message = "";
                var status = "";
                var updateCoachQuery = "UPDATE Coach set \n" +
                    "licensePlate ='" + licensePlate + "' , \n" +
                    "numberOfSeat=" + numberOfSeat + ", \n" +
                    "coachCompanyID=" + coachCompanyID + " \n" +
                    "where id =" + id;
                connection.request().query(updateCoachQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + updateCoachQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + updateCoachQuery;
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

    removeCoach(id, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var message = "";
                var status = "";
                var removeCoachQuery = "UPDATE Coach set isActive=0 where id=" + id;
                connection.request().query(removeCoachQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + removeCoachQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + removeCoachQuery;
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

    reactiveCoach(id, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var message = "";
                var status = "";
                var reactiveCoachQuery = "UPDATE Coach set isActive=1 where id=" + id;
                connection.request().query(reactiveCoachQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + reactiveCoachQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + reactiveCoachQuery;
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

    setTourInstance(id, tourInstanceID, callback) {
        connection.connect(err => {
            if (err) {
                console.log(err)
                connection.close()
            } else {
                var message = "";
                var status = "";
                var setTourInstanceQuery = "UPDATE Coach set TourInstanceID=" + tourInstanceID + " where id=" + id;
                connection.request().query(setTourInstanceQuery, (err, result) => {
                    if (err) {
                        message = statusMessageError + setTourInstanceQuery
                        status = statusFailed
                    } else {
                        message = statusMessageSuccess + setTourInstanceQuery
                        statusSuccess
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

module.exports = CoachDAO;