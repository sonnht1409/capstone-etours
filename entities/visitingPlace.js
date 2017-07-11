"use strict"
class VisitingPlace {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set name(name) {
        this._name = name;
    }

    get name(name) {
        return this._name
    }

    set latitude(latitude) {
        this._latitude = latitude;
    }

    get latitude() {
        return this._latitude;
    }

    set longitude(longitude) {
        this._longitude = longitude;
    }

    get longitude() {
        return this._longitude
    }

    set isActive(isActive) {
        this._isActive = isActive
    }

    get isActive() {
        return this._isActive
    }

    set type(type) {
        this._type = type;
    }

    get type() {
        return this._type;
    }
}

module.exports = VisitingPlace;