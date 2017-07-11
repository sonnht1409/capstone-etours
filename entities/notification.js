"use strict"
class Notification {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id
    }

    set message(message) {
        this._message = message;
    }

    get message() {
        return this._message
    }

    set time(time) {
        this._time = time;
    }

    get time() {
        return this._time
    }

    set isRead(isRead) {
        this._isRead = isRead
    }

    get isRead() {
        return this._isRead
    }

    set senderId(senderId) {
        this._senderId = senderId;
    }

    get senderId() {
        return this._senderId
    }

    set receiverId(receiverId) {
        this._receiverId = receiverId
    }

    get receiverId() {
        return this._receiverId
    }

    set type(type) {
        this._type = type;
    }

    get type() {
        return this._type
    }
}

module.exports = Notification;