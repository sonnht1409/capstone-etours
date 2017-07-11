"use strict"
class Card {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id
    }

    set cardCode(cardCode) {
        this._cardCode = cardCode;
    }

    get cardCode() {
        return this._cardCode
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

module.exports = Card;