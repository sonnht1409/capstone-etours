 "use strict";
 class User {
     constructor() {

     }

     set id(id) {
         this._id = id;
     }

     get id() {
         return this._id
     }

     set username(username) {
         this._username = username
     }

     get username() {
         return this._username
     }
     set password(password) {
         this._password = password
     }

     get password() {
         return this._password
     }

     set longitude(longitude) {
         this._longitude = longitude
     }

     get longitude() {
         return this._longitude
     }

     set latitude(latittude) {
         this._latittude = latittude
     }

     get latitude() {
         return this._latittude
     }

     set isActive(isActive) {
         this._isActive = isActive
     }

     get isActive() {
         return this._isActive
     }

     set tourInstanceId(tourInstanceId) {
         this._tourInstanceId = tourInstanceId
     }

     get tourInstanceId() {
         return this._tourInstanceId
     }

     set roleId(roleId) {
         this._roleId = roleId
     }

     get roleId() {
         return this._roleId
     }

     set touristStatus(touristStatus) {
         this._touristStatus = touristStatus
     }

     get touristStatus() {
         return this._touristStatus
     }

     set tourGuideStatus(tourGuideStatus) {
         this._tourGuideStatus = tourGuideStatus
     }

     get tourGuideStatus() {
         return this._tourGuideStatus
     }


 }

 module.exports = User;