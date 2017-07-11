"use strict"
class Role {
    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    set role(role) {
        this._role = role;
    }

    get role() {
        return this._role
    }

    set isActive(isActive) {
        this._isActive = isActive
    }

    get isActive() {
        return this._isActive
    }
}

module.exports = Role;