"use strict"
class Coach {

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id
    }

    set licensePlate(licensePlate) {
        this._licensePlate = licensePlate;
    }

    get licensePlate() {
        return this._licensePlate
    }

    set numberOfSeat(numberOfSeat) {
        this._numberOfSeat = numberOfSeat
    }

    get numberOfSeat() {
        return this._numberOfSeat
    }

    set isActive(isActive) {
        this._isActive = isActive
    }

    get isActive() {
        return this._isActive
    }

    set coachCompanyId(coachCompanyId) {
        this._coachCompanyId = coachCompanyId
    }

    get coachCompanyId() {
        return this._coachCompanyId
    }

    set tourInstanceId(tourInstanceId) {
        this._tourInstanceId = tourInstanceId
    }

    get tourInstanceId() {
        return this._tourInstanceId
    }
}

module.exports = Coach;