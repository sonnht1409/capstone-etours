var assert = require('chai').assert;

describe('User Model', () => {
    it('Getter and Setter', () => {
        var User = require(".././entities/user")
        var user = new User();
        user.username = "abc"
        user.password = "123";
        user.id = 1;
        user.latitude = 1.1;
        user.longitude = 1.1;
        user.tourInstanceId = 3;
        user.isActive = 1;
        user.roleId = 2;
        user.tourGuideStatus = 1;
        assert.strictEqual(user.username, "abc");
        assert.strictEqual(user.password, "123");
        assert.strictEqual(user.id, 1);
        assert.strictEqual(user.latitude, 1.1)
        assert.strictEqual(user.longitude, 1.1);
        assert.strictEqual(user.tourInstanceId, 3)
        assert.strictEqual(user.isActive, 1)
        assert.strictEqual(user.roleId, 2)
        assert.strictEqual(user.tourGuideStatus, 1);
    });
});

describe('Card Model', () => {
    it('Getter and Setter', () => {
        var Card = require(".././entities/card")
        var card = new Card();
        card.id = 1;
        card.cardCode = "ET00001";
        card.tourInstanceId = 1;
        card.userId = 1;
        assert.strictEqual(card.cardCode, "ET00001")
        assert.strictEqual(card.tourInstanceId, 1)
        assert.strictEqual(card.id, 1)
        assert.strictEqual(card.userId, 1);
    })
})

describe('Coach Model', () => {
    it('Getter and Setter', () => {
        var Coach = require(".././entities/coach")
        var coach = new Coach();
        coach.id = 1;
        coach.licensePlate = "64A3.132-23"
        coach.numberOfSeat = 16;
        coach.coachCompanyId = 1;
        coach.isActive = 1;
        coach.tourInstanceId = 2;
        assert.strictEqual(coach.id, 1)
        assert.strictEqual(coach.licensePlate, "64A3.132-23")
        assert.strictEqual(coach.numberOfSeat, 16)
        assert.strictEqual(coach.coachCompanyId, 1)
        assert.strictEqual(coach.isActive, 1);
        assert.strictEqual(coach.tourInstanceId, 2);
    })
})

describe('Coach Company Model', () => {
    it('Getter and Setter', () => {
        var CoachCompany = require(".././entities/coachCompany")
        var coachCompany = new CoachCompany();
        coachCompany.id = 1;
        coachCompany.name = "Phương Trang"
        coachCompany.isActive = 1;
        assert.strictEqual(coachCompany.id, 1)
        assert.strictEqual(coachCompany.name, "Phương Trang")
        assert.strictEqual(coachCompany.isActive, 1)
    })
})

describe('Notification Model', () => {
    it('Getter and Setter', () => {
        var Notification = require(".././entities/notification")
        var notification = new Notification();
        notification.id = 1;
        notification.message = "hello world!";
        notification.type = 1;
        notification.senderId = 1;
        notification.receiverId = 2;
        notification.time = new Date(1502804996157).toDateString();
        assert.strictEqual(notification.id, 1);
        assert.strictEqual(notification.message, "hello world!");
        assert.strictEqual(notification.type, 1);
        assert.strictEqual(notification.senderId, 1);
        assert.strictEqual(notification.receiverId, 2);
        assert.strictEqual(notification.time, new Date(1502804996157).toDateString());
    })
})

describe('Notification Type Model', () => {
    it('Getter and Setter', () => {
        var NotificationType = require(".././entities/notificationType")
        var notificationType = new NotificationType();
        notificationType.id = 1;
        notificationType.name = "Request pick up";
        notificationType.isActive = 1;
        assert.strictEqual(notificationType.id, 1);
        assert.strictEqual(notificationType.name, "Request pick up");
        assert.strictEqual(notificationType.isActive, 1);
    })
})

describe('Pick Up Model', () => {
    it('Getter and Setter', () => {
        var PickUp = require(".././entities/pickUp");
        var pickUp = new PickUp();
        pickUp.id = 1,
            pickUp.latitude = 1.1
        pickUp.longitude = 1.1
        pickUp.tourInstanceId = 1;
        pickUp.pickUpTime = new Date(1502804996157).toDateString();
        pickUp.userId = 1;
        pickUp.addedTime = new Date(1502804996157).toDateString();
        assert.strictEqual(pickUp.id, 1)
        assert.strictEqual(pickUp.latitude, 1.1)
        assert.strictEqual(pickUp.longitude, 1.1)
        assert.strictEqual(pickUp.pickUpTime, new Date(1502804996157).toDateString())
        assert.strictEqual(pickUp.userId, 1)
        assert.strictEqual(pickUp.addedTime, new Date(1502804996157).toDateString())
    })
})

describe('Place Model', () => {
    it('Getter and Setter', () => {
        var Place = require(".././entities/place")
        var place = new Place();
        place.id = 1;
        place.name = "Sài Gòn"
        place.isActive = 1;
        assert.strictEqual(place.id, 1)
        assert.strictEqual(place.name, "Sài Gòn")
        assert.strictEqual(place.isActive, 1)
    })
})

describe('Role Model', () => {
    it('Getter and Setter', () => {
        var Role = require(".././entities/role")
        var role = new Role();
        role.id = 1;
        role.role = "driver";
        role.isActive = 1;
        assert.strictEqual(role.id, 1)
        assert.strictEqual(role.role, "driver")
        assert.strictEqual(role.isActive, 1)
    })
})

describe('Scan History Model', () => {
    it('Getter and Setter', () => {
        var ScanHistory = require(".././entities/scanHistory")
        var scanHistory = new ScanHistory();
        scanHistory.id = 1;
        scanHistory.scheduleId = 1;
        scanHistory.coachID = 1;
        scanHistory.userID = 1;
        scanHistory.onTotal = "1/2"
        scanHistory.touristOff = "Hưng"
        scanHistory.note = "Bị ốm";
        assert.strictEqual(scanHistory.id, 1)
        assert.strictEqual(scanHistory.scheduleId, 1)
        assert.strictEqual(scanHistory.coachID, 1)
        assert.strictEqual(scanHistory.userID, 1)
        assert.strictEqual(scanHistory.onTotal, "1/2")
        assert.strictEqual(scanHistory.touristOff, "Hưng")
        assert.strictEqual(scanHistory.note, "Bị ốm");
    })
})

describe('Schedule Model', () => {
    it('Getter and Setter', () => {
        var Schedule = require(".././entities/schedule")
        var schedule = new Schedule();
        schedule.id = 1;
        schedule.startTime = new Date(1502804996157).toDateString();
        schedule.endTime = new Date(1502804996157).toDateString();
        schedule.actitivy = "ăn sáng"
        schedule.tourInstanceDetailId = 1;
        schedule.visitingPlaceId = 1;
        schedule.coachId = 1;

        assert.strictEqual(schedule.id, 1)
        assert.strictEqual(schedule.startTime, new Date(1502804996157).toDateString())
        assert.strictEqual(schedule.endTime, new Date(1502804996157).toDateString())
        assert.strictEqual(schedule.actitivy, "ăn sáng")
        assert.strictEqual(schedule.tourInstanceDetailId, 1)
        assert.strictEqual(schedule.visitingPlaceId, 1)
        assert.strictEqual(schedule.coachId, 1)
    })
})

describe('Tour Model', () => {
    it('Getter and Setter', () => {
        var Tour = require(".././entities/tour")
        var tour = new Tour();
        tour.id = 1;
        tour.startPlace = 1;
        tour.destination = 2;
        tour.name = "Đà Nẵng - Hội An"
        tour.duration = "2 ngày 1 đêm"
        tour.description = " "
        tour.isActive = 1;
        assert.strictEqual(tour.id, 1);
        assert.strictEqual(tour.startPlace, 1)
        assert.strictEqual(tour.destination, 2)
        assert.strictEqual(tour.name, "Đà Nẵng - Hội An")
        assert.strictEqual(tour.duration, "2 ngày 1 đêm")
        assert.strictEqual(tour.description, " ")
        assert.strictEqual(tour.isActive, 1)

    })
})

describe('Tourist Status Model', () => {
    it('Getter and Setter', () => {
        var TouristStatus = require(".././entities/touristStatus")
        var touristStatus = new TouristStatus();
        touristStatus.id = 1;
        touristStatus.name = "on"
        touristStatus.isActive = 1;
        assert.strictEqual(touristStatus.id, 1);
        assert.strictEqual(touristStatus.name, "on");
        assert.strictEqual(touristStatus.isActive, 1);
    })
})

describe('Tour Guide Status Model', () => {
    it('Getter and Setter', () => {
        var TourGuideStatus = require(".././entities/tourGuideStatus");
        var tourGuideStatus = new TourGuideStatus();
        tourGuideStatus.id = 1;
        tourGuideStatus.name = "working"
        tourGuideStatus.isActive = 1;
        assert.strictEqual(tourGuideStatus.id, 1);
        assert.strictEqual(tourGuideStatus.name, "working");
        assert.strictEqual(tourGuideStatus.isActive, 1);
    })
})

describe('Tour Instance Detail Model', () => {
    it('Getter and Setter', () => {
        var TourInstanceDetail = require(".././entities/tourInstanceDetail")
        var tourInstanceDetail = new TourInstanceDetail();
        tourInstanceDetail.id = 1;
        tourInstanceDetail.tourInstanceId = 1;
        tourInstanceDetail.tourTime = "Day 1"
        tourInstanceDetail.isActive = 1;
        assert.strictEqual(tourInstanceDetail.id, 1)
        assert.strictEqual(tourInstanceDetail.tourInstanceId, 1);
        assert.strictEqual(tourInstanceDetail.tourTime, "Day 1");
        assert.strictEqual(tourInstanceDetail.isActive, 1);
    })
})

describe('Tour Instance Model', () => {
    it('Getter and Setter', () => {
        var TourInstance = require(".././entities/tourInstance")
        var tourInstance = new TourInstance();
        tourInstance.id = 1;
        tourInstance.startTime = new Date(1502804996157).toDateString()
        tourInstance.endTime = new Date(1502804996157).toDateString()
        tourInstance.tourId = 1;
        tourInstance.status = 1;
        tourInstance.isActive = 1;

        assert.strictEqual(tourInstance.id, 1);
        assert.strictEqual(tourInstance.startTime, new Date(1502804996157).toDateString());
        assert.strictEqual(tourInstance.endTime, new Date(1502804996157).toDateString());
        assert.strictEqual(tourInstance.tourId, 1);
        assert.strictEqual(tourInstance.status, 1);
        assert.strictEqual(tourInstance.isActive, 1);
    })
})

describe('Tour Instance Status Model', () => {
    it('Getter and Setter', () => {
        var TourInstanceStatus = require(".././entities/tourInstanceStatus")
        var tourInstanceStatus = new TourInstanceStatus();
        tourInstanceStatus.id = 1;
        tourInstanceStatus.name = "Planned"
        tourInstanceStatus.isActive = 1;
        assert.strictEqual(tourInstanceStatus.id, 1);
        assert.strictEqual(tourInstanceStatus.name, "Planned");
        assert.strictEqual(tourInstanceStatus.isActive, 1);
    })
})

describe('Tour Visiting Place Model', () => {
    it('Getter and Setter', () => {
        var TourVisitingPlace = require(".././entities/tourVisitingPlace")
        var tourVisitingPlace = new TourVisitingPlace();
        tourVisitingPlace.id = 1;
        tourVisitingPlace.tourId = 1;
        tourVisitingPlace.visitingPlaceId = 1;
        tourVisitingPlace.priority = 1;
        assert.strictEqual(tourVisitingPlace.id, 1);
        assert.strictEqual(tourVisitingPlace.tourId, 1);
        assert.strictEqual(tourVisitingPlace.visitingPlaceId, 1);
        assert.strictEqual(tourVisitingPlace.priority, 1);
    })
})

describe('User Coach Seat Number Model', () => {
    it('Getter and Setter', () => {
        var UserCoachSeatNumber = require(".././entities/userCoachSeatNumber")
        var userCoachSeatNumber = new UserCoachSeatNumber();
        userCoachSeatNumber.id = 1;
        userCoachSeatNumber.coachId = 1;
        userCoachSeatNumber.userId = 1;
        userCoachSeatNumber.seatNumber = "A1"

        assert.strictEqual(userCoachSeatNumber.id, 1);
        assert.strictEqual(userCoachSeatNumber.coachId, 1);
        assert.strictEqual(userCoachSeatNumber.userId, 1);
        assert.strictEqual(userCoachSeatNumber.seatNumber, "A1");
    })
})

describe('User Info Model', () => {
    it('Getter and Setter', () => {
        var UserInfo = require(".././entities/userInfo")
        var userInfo = new UserInfo();
        userInfo.id = 1;
        userInfo.userId = 1;
        userInfo.birthday = new Date(1502804996157).toDateString();
        userInfo.fullname = "Trần Văn A"
        userInfo.gender = 1;
        userInfo.userIdNumber = "123456"
        userInfo.phoneNumber = "0909111111"

        assert.strictEqual(userInfo.id, 1);
        assert.strictEqual(userInfo.userId, 1);
        assert.strictEqual(userInfo.birthday, new Date(1502804996157).toDateString());
        assert.strictEqual(userInfo.fullname, "Trần Văn A");
        assert.strictEqual(userInfo.gender, 1);
        assert.strictEqual(userInfo.userIdNumber, "123456");
        assert.strictEqual(userInfo.phoneNumber, "0909111111");
    })
})

describe('Visiting Place Model', () => {
    it('Getter and Setter', () => {
        var VisitingPlace = require(".././entities/visitingPlace");
        var visitingPlace = new VisitingPlace();
        visitingPlace.id = 1;
        visitingPlace.latitude = 1.1
        visitingPlace.longitude = 1.1
        visitingPlace.name = "Ghềnh Bàng"
        visitingPlace.type = 1
        visitingPlace.isActive = 1;
        visitingPlace.imageLink = "http://103.68.251.134:1001/UploadImage/images/10_diem_an_tuong_bd_sonta_5.jpg"

        assert.strictEqual(visitingPlace.id, 1);
        assert.strictEqual(visitingPlace.latitude, 1.1);
        assert.strictEqual(visitingPlace.longitude, 1.1);
        assert.strictEqual(visitingPlace.name, "Ghềnh Bàng");
        assert.strictEqual(visitingPlace.type, 1);
        assert.strictEqual(visitingPlace.isActive, 1);
        assert.strictEqual(visitingPlace.imageLink, "http://103.68.251.134:1001/UploadImage/images/10_diem_an_tuong_bd_sonta_5.jpg");

    })
})

describe('Visiting Place Type Model', () => {
    it('Getter and Setter', () => {
        var VisitingPlaceType = require(".././entities/visitingPlaceType");
        var visitingPlaceType = new VisitingPlaceType();
        visitingPlaceType.id = 1;
        visitingPlaceType.name = "Điểm tham quan"
        visitingPlaceType.isActive = 1;

        assert.strictEqual(visitingPlaceType.id, 1)
        assert.strictEqual(visitingPlaceType.name, "Điểm tham quan")
        assert.strictEqual(visitingPlaceType.isActive, 1)
    })
})