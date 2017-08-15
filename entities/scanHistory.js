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

    set touristOff(touristOff) {
        this._touristOff = touristOff
    }

    get touristOff() {
        return this._touristOff
    }

    set userID(userID) {
        this._userID = userID;
    }

    get userID() {
        return this._userID
    }

    set coachID(coachID) {
        this._coachID = coachID;
    }

    get coachID() {
        return this._coachID
    }

    set onTotal(onTotal) {
        this._onTotal = onTotal;
    }

    get onTotal() {
        return this._onTotal;
    }

    set note(note) {
        this._note = note;
    }

    get note() {
        return this._note;
    }
}

module.exports = ScanHistory