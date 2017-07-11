"use strict"
class TourVisitingPlace {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set priority(priority) {
        this._priorirty = priority
    }

    get priority() {
        return this._priorirty
    }

    set tourId(tourId) {
        this._tourId = tourId
    }

    get tourId() {
        return this._tourId
    }

    set visitingPlaceId(visitingPlaceId) {
        this._visitingPlaceId = visitingPlaceId;
    }

    get visitingPlaceId() {
        return this._visitingPlaceId
    }
}

module.exports = TourVisitingPlace;