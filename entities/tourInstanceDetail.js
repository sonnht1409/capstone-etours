"use strict"
class TourInstanceDeatail {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id
    }

    set tourTime(tourTime) {
        this._tourTime = tourTime;
    }

    get tourTime() {
        return this._tourTime;
    }

    set isActive(isActive) {
        this._isActive = isActive;
    }

    get isActive() {
        return this._isActive
    }

    set tourInstanceId(tourInstanceId) {
        this._tourInstanceId = tourInstanceId;
    }

    get tourInstanceId() {
        return this._tourInstanceId
    }
}

module.exports = TourInstanceDeatail;