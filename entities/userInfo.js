"use strict"
class UserInfo {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set birthday(birthday) {
        this._birthday = birthday;
    }

    get birthday() {
        return this._birthday
    }

    set gender(gender) {
        this._gender = gender;
    }

    get gender() {
        return this._gender
    }

    set userIdNumber(userIdNumber) {
        this._userIdNumber = userIdNumber
    }

    get userIdNumber() {
        return this._userIdNumber
    }

    set fullname(fullname) {
        this._fullname = fullname;
    }

    get fullname() {
        return this._fullname;
    }

    set phoneNumber(phoneNumber) {
        this._phoneNumber = phoneNumber;
    }

    get phoneNumber() {
        return this._phoneNumber
    }

    set userId(userId) {
        this._userId = userId
    }

    get userId() {
        return this._userId
    }
}

module.exports = UserInfo;