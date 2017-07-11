"use strict"
class TourInstance {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set startTime(startTime) {
        this._startTime = startTime;
    }

    get startTime() {
        return this._startTime
    }

    set endTime(endTime) {
        this._endTime = endTime;
    }

    get endTime() {
        return this._endTime;
    }

    set isActive(isActive) {
        this._isActive = isActive
    }

    get isActive() {
        return this._isActive
    }

    set tourId(tourId) {
        this._tourId = tourId;
    }

    get tourId() {
        return this._tourId;
    }

    set status(status) {
        this._status = status
    }

    get status() {
        return this._status
    }
}

module.exports = TourInstance;