"use strict"
class Schedule {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id
    }

    set startTime(startTime) {
        this._startTime = startTime
    }

    get startTime() {
        return this._startTime
    }

    set endTime(endTime) {
        this._endTime = endTime
    }

    get endTime() {
        return this._endTime
    }

    set actitivy(actitivy) {
        this._activity = actitivy;
    }

    get actitivy() {
        return this._activity
    }

    set tourInstanceDetailId(tourInstanceDetailId) {
        this._tourInstanceDetailId = tourInstanceDetailId
    }

    get tourInstanceDetailId() {
        return this._tourInstanceDetailId
    }

    set visitingPlaceId(visitingPlaceId) {
        this._visitingPlaceId = visitingPlaceId;
    }

    get visitingPlaceId() {
        return this._visitingPlaceId
    }
}

module.exports = Schedule;