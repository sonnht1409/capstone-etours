"use strict"
class ScanHistory {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set scheduleId(scheduleId) {
        this._scheduleId = scheduleId;
    }

    get scheduleId() {
        return this._scheduleId
    }

    set tourist(tourist) {
        this._tourist = tourist
    }

    get tourist() {
        return this._tourist
    }

    set tourGuide(tourGuide) {
        this._tourGuide = tourGuide;
    }

    get tourGuide() {
        return this._tourGuide
    }

    set touristStatus(touristStatus) {
        this._touristStatus = touristStatus;
    }

    get touristStatus() {
        return this._touristStatus
    }

    set scanTime(scanTime) {
        this._scanTime = scanTime;
    }

    get scanTime() {
        return this._scanTime;
    }
}

module.exports = ScanHistory