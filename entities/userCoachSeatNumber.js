"use strict"
class UserCoachSeatNumber {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set seatNumber(seatNumber) {
        this._seatNumber = seatNumber;
    }

    get seatNumber() {
        return this._seatNumber
    }

    set userId(userId) {
        this._userId = userId;
    }

    get userId() {
        return this._userId
    }

    set coachId(coachId) {
        this._coachId = coachId;
    }

    get coachId() {
        return this._coachId
    }
}

module.exports = UserCoachSeatNumber