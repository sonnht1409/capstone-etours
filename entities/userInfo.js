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

    set email(email) {
        this._email = email
    }

    get email() {
        return this._email
    }

    set address(address) {
        this._address = address
    }

    get address() {
        return this._address
    }

    set userIdNumber(userIdNumber) {
        this._userIdNumber = userIdNumber
    }

    get userIdNumber() {
        return this._userIdNumber
    }

    set userId(userId) {
        this._userId = userId
    }

    get userId() {
        return this._userId
    }
}

module.exports = UserInfo;