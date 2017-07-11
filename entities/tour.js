"use strict"
class Tour {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name
    }

    set duration(duration) {
        this._duration = duration;
    }

    get duration() {
        return this._duration
    }

    set description(description) {
        this._description = description;
    }

    get description() {
        return this._description;
    }

    set isActive(isActive) {
        this._isActive = isActive
    }

    get isActive() {
        return this._isActive
    }

    set startPlace(startPlace) {
        this._startPlace = startPlace;
    }

    get startPlace() {
        return this._startPlace;
    }

    set destination(destination) {
        this._destination = destination;
    }

    get destination() {
        return this._destination
    }
}

module.exports = Tour;