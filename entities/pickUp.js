"use strict"
class PickUp {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set latitude(latitude) {
        this._latitude = latitude;
    }

    get latitude() {
        return this._latitude
    }

    set longitude(longitude) {
        this._longitude = longitude;
    }

    get longitude() {
        return this._longitude
    }

    set pickUpTime(pickUpTime) {
        this._pickUpTime = pickUpTime
    }

    get pickUpTime() {
        return this._pickUpTime;
    }

    set addedTime(addedTime) {
        this._addedTime = addedTime;
    }

    get addedTime() {
        return this._addedTime;
    }

    set tourInstanceId(tourInstanceId) {
        this._tourInstanceId = tourInstanceId;
    }

    get tourInstanceId() {
        return this._tourInstanceId
    }

    set userId(userId) {
        this._userId = userId;
    }

    get userId() {
        return this._userId
    }
}

module.exports = PickUp;