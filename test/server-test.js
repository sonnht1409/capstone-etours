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
        coach.tourInstanceId = 3
        assert.strictEqual(coach.id, 1)
        assert.strictEqual(coach.licensePlate, "64A3.132-23")
        assert.strictEqual(coach.numberOfSeat, 16)
        assert.strictEqual(coach.coachCompanyId, 1)
        assert.strictEqual(coach.isActive, 1);
        assert.strictEqual(coach.tourInstanceId, 3);
    })
})