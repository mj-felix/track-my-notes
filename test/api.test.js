require('dotenv').config();
const path = require('path');
const request = require('supertest')('http://localhost:5000/api/v1');
const requestS3 = require('supertest')('https://track-my-notes-dev.s3.amazonaws.com');
const expect = require('chai').expect;

const errors = require('../backend/messages/errorMessages.js');

const User = require('../backend/models/userModel.js');

// data setup
const user1 = {};
const user2 = {};
// userX to be holding objects for test data
// user1.refreshToken, .accessToken - to be used for authentication
// user1.tag0 - to be used for tag's creation, update, deletion
// user1.tag1, .tag2, .tag3 - to be used for notes' creation and update
// user1.note0 - to be used for notes's creation, retrieval, update, deletion
// user1.note1, .note2, .note3, .note4 - to be used for notes' retrieval
// user1.fileKey0, .fileKey1 - to be used for file's upload and deletion
// user2.accessToken, .tag1, .note1 - to be used for authorisation

describe('User registration', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/auth/register';

    it("fails when invalid profile name, email or password provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mocha_1",
            "email": "mochatest.com",
            "password": "mocha"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(500);
        expect(response.body.message).includes(errors.user.INVALID_PROFILE_NAME);
        expect(response.body.message).includes(errors.user.INVALID_EMAIL);
        expect(response.body.message).includes(errors.user.INVALID_PASSWORD);
    });

    it("succeeds when valid profile name, email or password provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mOcha_one",
            "email": "mochaOne@test.com",
            "password": "Mocha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('user', 'accessToken', 'refreshToken');
        expect(response.body.user).to.not.include.all.keys('password', 'refreshToken');
        expect(response.body.user.isAdmin).to.be.true;
        expect(response.body.user.isPublic).to.be.false;
        expect(response.body.user.email).to.eql('mochaone@test.com');
        expect(response.body.user.profileName).to.eql('mocha_one');

        // data setup
        user1._id = response.body.user._id;
    });

    it("fails when existing profile name provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mocha_one",
            "email": "mochaOne1@test.com",
            "password": "Mocha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(400);
        expect(response.body.message).includes(errors.user.PROFILE_NAME_EXISTS);
    });

    it("fails when existing email provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mocha_two",
            "email": "mochaOne@test.com",
            "password": "Mocha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(400);
        expect(response.body.message).includes(errors.user.EMAIL_EXISTS);
    });

    it("succeeds when non-admin email provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mocha-two",
            "email": "mochaTwo@test.com",
            "password": "Mocha2#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('user', 'accessToken', 'refreshToken');
        expect(response.body.user).to.not.include.all.keys('password', 'refreshToken');
        expect(response.body.user.isAdmin).to.be.false;
        expect(response.body.user.isPublic).to.be.false;
        expect(response.body.user.email).to.eql('mochatwo@test.com');
        expect(response.body.user.profileName).to.eql('mocha-two');

        // data setup
        user2.accessToken = response.body.accessToken;
        user2.profileName = response.body.user.profileName;
    });

});

describe('User login', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/auth/login';

    it("fails when incorrect email provided", async () => {

        // GIVEN:
        const payload = {
            "email": "mochaOne@test1.com",
            "password": "Mocha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).includes(errors.auth.INVALID_CREDENTIALS);
    });

    it("fails when incorrect password provided", async () => {

        // GIVEN:
        const payload = {
            "email": "mochaOne@test.com",
            "password": "Mocha2#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).includes(errors.auth.INVALID_CREDENTIALS);
    });

    it("succeeds when correct credentials provided", async () => {

        // GIVEN:
        const payload = {
            "email": "mochaOne@test.com",
            "password": "Mocha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.include.all.keys('user', 'accessToken', 'refreshToken');
        expect(response.body.user).to.not.include.all.keys('password', 'refreshToken');
        expect(response.body.user.isAdmin).to.be.true;
        expect(response.body.user.isPublic).to.be.false;
        expect(response.body.user.email).to.eql('mochaone@test.com');
        expect(response.body.user.profileName).to.eql('mocha_one');

        // data setup
        user1.refreshToken = response.body.refreshToken;
        user1.profileName = response.body.user.profileName;
    });
});

describe('Refresh token', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/auth/refreshaccesstoken';

    it("fails when no refresh token provided", async () => {

        // GIVEN:

        // WHEN:
        const response = await request
            .post(endpoint);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).includes(errors.auth.REFRESH_TOKEN_FAILED);
    });

    it("fails when incorrect refresh token provided", async () => {

        // GIVEN:
        const refreshToken = 'incorrectToken';

        // WHEN:
        const response = await request
            .post(endpoint)
            .set("Authorization", `Bearer {refreshToken}`);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).includes(errors.auth.REFRESH_TOKEN_FAILED);
    });

    it("succeeds when correct refresh token provided", async () => {

        // GIVEN:
        const refreshToken = user1.refreshToken;

        // WHEN:
        const response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${refreshToken}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.accessToken).to.not.eql('');

        // data setup
        user1.accessToken = response.body.accessToken;
    });
});

describe('User profile retrieval', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/users/profile';

    it("succeeds when correct access token provided", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;

        // WHEN:
        const response = await request
            .get(endpoint)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.not.include.all.keys('password', 'refreshToken');
        expect(response.body.isAdmin).to.be.true;
        expect(response.body.isPublic).to.be.false;
        expect(response.body.email).to.eql('mochaone@test.com');
        expect(response.body.profileName).to.eql('mocha_one');
    });

    it("fails when no access token provided", async () => {

        // GIVEN:

        // WHEN:
        const response = await request
            .get(endpoint);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql(errors.auth.ACCESS_TOKEN_FAILED);
    });

    it("fails when incorrect access token provided", async () => {

        // GIVEN:
        const accessToken = 'incorrectToken';

        // WHEN:
        const response = await request
            .get(endpoint)
            .set("Authorization", `Bearer ${accessToken}`);;

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql(errors.auth.ACCESS_TOKEN_FAILED);
    });
});

describe('User profile update', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/users/profile';

    it("succeeds when correct access token provided", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const payload = {
            "profileName": "mOcha-one",
            "email": "",
            "password": "",
            "isPublic": true,
            "firstName": "MJ",
            "lastName": "Felix",
            "linkedIn": "https://www.linkedin.com/in/mjfelix/",
            "twitter": "https://twitter.com/mjfelixdev",
            "gitHub": "https://github.com/mj-felix",
            "homepage": "https://mjfelix.dev",
            "bio": "Tech BA turned Dev :-)",
            "location": "Wellington, NZ"
        };

        // WHEN:
        const response = await request
            .put(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.not.include.any.keys('password', 'refreshToken');
        expect(response.body.isAdmin).to.be.true;
        expect(response.body.isPublic).to.be.true;
        expect(response.body.email).to.eql('mochaone@test.com');
        expect(response.body.profileName).to.eql('mocha-one');
        expect(response.body.firstName).to.eql('MJ');
        expect(response.body.lastName).to.eql('Felix');
        expect(response.body.linkedIn).to.eql('https://www.linkedin.com/in/mjfelix/');
        expect(response.body.twitter).to.eql('https://twitter.com/mjfelixdev');
        expect(response.body.gitHub).to.eql('https://github.com/mj-felix');
        expect(response.body.homepage).to.eql('https://mjfelix.dev');
        expect(response.body.bio).to.eql('Tech BA turned Dev :-)');
        expect(response.body.location).to.eql('Wellington, NZ');

        // data setup
        user1.profileName = response.body.profileName;
    });

    it("fails when no access token provided", async () => {

        // GIVEN:
        const payload = {
            "profileName": "mOcha-one",
        };

        // WHEN:
        const response = await request
            .put(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql(errors.auth.ACCESS_TOKEN_FAILED);
    });

    it("fails when incorrect access token provided", async () => {

        // GIVEN:
        const accessToken = 'incorrectToken';
        const payload = {
            "profileName": "mOcha-one",
        };


        // WHEN:
        const response = await request
            .put(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(401);
        expect(response.body.message).to.eql(errors.auth.ACCESS_TOKEN_FAILED);
    });

    it("fails when invalid email and password provided", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const payload = {
            "email": "incorrectemail",
            "password": "incorrectpassword",
        };

        // WHEN:
        const response = await request
            .put(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(500);
        expect(response.body.message).includes(errors.user.INVALID_EMAIL);
        expect(response.body.message).includes(errors.user.INVALID_PASSWORD);
    });

    it("succeeds when valid email and password provided", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const payload = {
            "email": "mocha-one@test.com",
            "password": "mOcha1#",
        };

        // WHEN:
        const response = await request
            .put(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.not.include.any.keys('password', 'refreshToken');
        expect(response.body.isAdmin).to.be.true;
        expect(response.body.isPublic).to.be.true;
        expect(response.body.email).to.eql('mocha-one@test.com');
        expect(response.body.profileName).to.eql('mocha-one');
        expect(response.body.firstName).to.eql('MJ');
        expect(response.body.lastName).to.eql('Felix');
        expect(response.body.linkedIn).to.eql('https://www.linkedin.com/in/mjfelix/');
        expect(response.body.twitter).to.eql('https://twitter.com/mjfelixdev');
        expect(response.body.gitHub).to.eql('https://github.com/mj-felix');
        expect(response.body.homepage).to.eql('https://mjfelix.dev');
        expect(response.body.bio).to.eql('Tech BA turned Dev :-)');
        expect(response.body.location).to.eql('Wellington, NZ');
    });

    it("is followed by succeessful login with updated credentials provided", async () => {

        // GIVEN:
        const endpoint = '/auth/login';
        const payload = {
            "email": "mocha-One@test.com",
            "password": "mOcha1#"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.include.all.keys('user', 'accessToken', 'refreshToken');
        expect(response.body.user).to.not.include.all.keys('password', 'refreshToken');
        expect(response.body.user.isAdmin).to.be.true;
        expect(response.body.user.isPublic).to.be.true;
        expect(response.body.user.email).to.eql('mocha-one@test.com');
        expect(response.body.user.profileName).to.eql('mocha-one');
    });
});

describe('Tags', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/tags';

    it("creation successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const userId = user1._id;
        const payload = {
            "name": "Tag to play with"
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body).to.include.all.keys('_id', 'name', 'user');
        expect(response.body.user).to.eql(userId);
        expect(response.body.name).to.eql('tag to play with');

        // data setup
        user1.tag0 = response.body._id;
    });

    it("update fails when not user's tag", async () => {

        // GIVEN:
        const accessToken = user2.accessToken;
        const tagId = user1.tag0;
        const payload = {
            "name": "Tag updated"
        };

        // WHEN:
        const response = await request
            .put(`${endpoint}/${tagId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.tag.NOT_USERS_TAG);
    });

    it("update successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const tagId = user1.tag0;
        const userId = user1._id;
        const payload = {
            "name": "Tag updated"
        };

        // WHEN:
        const response = await request
            .put(`${endpoint}/${tagId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.include.all.keys('_id', 'name', 'user');
        expect(response.body.user).to.eql(userId);
        expect(response.body.name).to.eql('tag updated');
    });

    it("deletion fails when not user's tag", async () => {

        // GIVEN:
        const accessToken = user2.accessToken;
        const tagId = user1.tag0;

        // WHEN:
        const response = await request
            .delete(`${endpoint}/${tagId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.tag.NOT_USERS_TAG);
    });

    it("deletion successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const tagId = user1.tag0;

        // WHEN:
        const response = await request
            .delete(`${endpoint}/${tagId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(204);
        expect(response.body).to.be.empty;
    });

    it("retrieval successful", async () => {

        // GIVEN:
        const accessToken1 = user1.accessToken;
        const accessToken2 = user2.accessToken;
        const payload1 = {
            "name": "Tag 1"
        };
        const payload2 = {
            "name": "Tag 2"
        };
        const payload3 = {
            "name": "Tag 3"
        };
        const payload4 = {
            "name": "Tag 1 of user 2"
        };

        // WHEN:
        let response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload1);

        // data setup
        user1.tag1 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload2);

        // data setup
        user1.tag2 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload3);

        // data setup
        user1.tag3 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken2}`)
            .send(payload4);

        // data setup
        user2.tag1 = response.body._id;

        response = await request
            .get(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.length).to.eql(3);
        const tagIds = response.body.map(tag => tag._id);
        expect(tagIds).to.not.include(user1.tag0);
        expect(tagIds).to.not.include(user2.tag1);
        expect(tagIds).to.have.members([user1.tag1, user1.tag2, user1.tag3]);
    });
});

describe('Notes', () => {

    // 'GLOBAL' GIVEN
    const endpoint = '/notes';

    it("creation fails when other user's tag provided", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const payload = {
            "title": "Note 0",
            "link": "https://note0.pl",
            "isSticky": false,
            "isPublic": true,
            "description": "Note 0 description",
            "madePublicAt": "2021-11-30",
            "tags": [
                user2.tag1,
                user1.tag2
            ]
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.tag.NOT_USERS_TAG);
    });

    it("creation successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const userId = user1._id;
        const payload = {
            "title": "Note 0",
            "link": "https://note0.pl",
            "isSticky": false,
            "isPublic": true,
            "description": "Note 0 description",
            "madePublicAt": "2021-11-30",
            "tags": [
                user1.tag1,
                user1.tag2
            ]
        };

        // WHEN:
        const response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(201);
        expect(response.body.title).to.eql('Note 0');
        expect(response.body.link).to.eql('https://note0.pl');
        expect(response.body.isSticky).to.be.false;
        expect(response.body.isPublic).to.be.true;
        expect(response.body.description).to.eql('Note 0 description');
        expect(response.body.madePublicAt).includes('2021-11-30');
        expect(response.body.user).to.eql(userId);
        const tagIds = response.body.tags.map(tag => tag._id);
        expect(tagIds).to.have.members([user1.tag1, user1.tag2]);

        // data setup
        user1.note0 = response.body._id;
    });

    it("single note's retrieval successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const userId = user1._id;
        const noteId = user1.note0;

        // WHEN:
        const response = await request
            .get(`${endpoint}/${noteId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.title).to.eql('Note 0');
        expect(response.body.link).to.eql('https://note0.pl');
        expect(response.body.isSticky).to.be.false;
        expect(response.body.isPublic).to.be.true;
        expect(response.body.description).to.eql('Note 0 description');
        expect(response.body.madePublicAt).includes('2021-11-30');
        expect(response.body.user).to.eql(userId);
        const tagIds = response.body.tags.map(tag => tag._id);
        expect(tagIds).to.have.members([user1.tag1, user1.tag2]);
    });

    it("update fails when not user's note", async () => {

        // GIVEN:
        const accessToken = user2.accessToken;
        const noteId = user1.note0;
        const payload = {
            "link": "https://note0updated.pl",
            "isSticky": true,
            "description": "Note 0 updated description"
        };

        // WHEN:
        const response = await request
            .put(`${endpoint}/${noteId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.note.NOT_USERS_NOTE);
    });

    it("update successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const noteId = user1.note0;
        const payload = {
            "link": "https://note0updated.pl",
            "isSticky": true,
            "description": "Note 0 updated description"
        };

        // WHEN:
        const response = await request
            .put(`${endpoint}/${noteId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(payload);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.title).to.eql('Note 0');
        expect(response.body.link).to.eql('https://note0updated.pl');
        expect(response.body.isSticky).to.be.true;
        expect(response.body.isPublic).to.be.false;
        expect(response.body.description).to.eql('Note 0 updated description');
        expect(response.body.madePublicAt).to.be.null;
        expect(response.body.tags).to.be.empty;
    });

    it("deletion fails when not user's note", async () => {

        // GIVEN:
        const accessToken = user2.accessToken;
        const noteId = user1.note0;

        // WHEN:
        const response = await request
            .delete(`${endpoint}/${noteId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.note.NOT_USERS_NOTE);
    });

    it("deletion successful", async () => {

        // GIVEN:
        const accessToken = user1.accessToken;
        const noteId = user1.note0;

        // WHEN:
        const response = await request
            .delete(`${endpoint}/${noteId}`)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(204);
        expect(response.body).to.be.empty;
    });

    it("multiple notes' retrieval successful (inc. order, search and pagination)", async () => {

        // GIVEN:
        const accessToken1 = user1.accessToken;
        const accessToken2 = user2.accessToken;
        const payload1 = {
            "title": "Note 1",
            "isSticky": true,
            "isPublic": true,
            "description": "note 3",
            "madePublicAt": "2021-11-25",
            "tags": [
                user1.tag1,
            ]
        };
        const payload2 = {
            "title": "Note 2",
            "isSticky": false,
            "isPublic": true,
            "madePublicAt": "2021-11-26",
            "tags": [
                user1.tag1,
                user1.tag2,
            ]
        };
        const payload3 = {
            "title": "Note 3",
            "isSticky": false,
            "isPublic": true,
            "madePublicAt": "2021-11-27",
            "tags": [
                user1.tag1,
                user1.tag2,
                user1.tag3,
            ]
        };
        const payload4 = {
            "title": "Note 4",
            "link": "Note 3.pl",
            "isSticky": true,
            "isPublic": false,
            "madePublicAt": "2021-11-28",
            "tags": [
                user1.tag1,
                user1.tag2,
            ]
        };
        const payload5 = {
            "title": "Note 1 of user 2",
            "isSticky": true,
            "isPublic": false,
            "madePublicAt": "2021-11-28",
            "tags": [
                user2.tag1,
            ]
        };

        // WHEN:
        let response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload1);

        // data setup
        user1.note1 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload2);

        // data setup
        user1.note2 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload3);

        // data setup
        user1.note3 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`)
            .send(payload4);

        // data setup
        user1.note4 = response.body._id;

        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken2}`)
            .send(payload5);

        // data setup
        user2.note1 = response.body._id;

        response = await request
            .get(endpoint)
            .set("Authorization", `Bearer ${accessToken1}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(4);
        expect(response.body.notesCount).to.eql(4);
        expect(response.body.page).to.eql(1);
        expect(response.body.pageSize).to.eql(10);
        expect(response.body.pages).to.eql(1);
        const noteIds = response.body.notes.map(note => note._id);
        expect(noteIds).to.not.include(user1.note0);
        expect(noteIds).to.not.include(user2.note1);
        expect(noteIds).to.have.ordered.members([user1.note4, user1.note1, user1.note3, user1.note2]);

        // WHEN:
        response = await request
            .get(`${endpoint}?pageSize=2&page=2&tags=${user1.tag1},${user1.tag2}`)
            .set("Authorization", `Bearer ${accessToken1}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(1);
        expect(response.body.notesCount).to.eql(3);
        expect(response.body.page).to.eql(2);
        expect(response.body.pageSize).to.eql(2);
        expect(response.body.pages).to.eql(2);

        // WHEN:
        response = await request
            .get(`${endpoint}?pageSize=5&page=1&search=note%203&tags=${user1.tag1}`)
            .set("Authorization", `Bearer ${accessToken1}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(3);
        expect(response.body.notesCount).to.eql(3);
        expect(response.body.page).to.eql(1);
        expect(response.body.pageSize).to.eql(5);
        expect(response.body.pages).to.eql(1);
        expect(response.body.notes.map(note => note._id))
            .to.have.ordered.members([user1.note4, user1.note1, user1.note3]);
    });
});

describe('Files', function () {
    this.timeout(10000);

    it("upload fails when attepmted agaist not user's note", async () => {

        // GIVEN:
        const endpoint = `/notes/${user2.note1}/files`;
        const accessToken = user1.accessToken;
        const filePath0 = `${__dirname}/Thank_You_Kitty.png`;

        // WHEN:
        let response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .attach('file', filePath0);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.note.NOT_USERS_NOTE);
    });

    it("upload successful", async () => {

        // GIVEN:
        const endpoint = `/notes/${user1.note1}/files`;
        const accessToken = user1.accessToken;
        const filePath0 = `${__dirname}/Thank_You_Kitty.png`;
        const filePath1 = `${__dirname}/awesomeness.jpg`;

        // WHEN:
        let response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .attach('file', filePath0);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body._id).to.eql(user1.note1);
        expect(response.body.user).to.eql(user1._id);
        expect(response.body.files[0].originalFileName).to.eql('Thank_You_Kitty.png');
        expect(response.body.files[0].bucket).to.eql('track-my-notes-dev');
        expect(response.body.files[0].url).includes('https://track-my-notes-dev.s3');

        // data setup
        user1.fileKey0 = response.body.files[0].storedFileName;

        // WHEN:
        response = await requestS3.get('/' + user1.fileKey0);

        // THEN:
        expect(response.status).to.eql(200);

        // data setup
        response = await request
            .post(endpoint)
            .set("Authorization", `Bearer ${accessToken}`)
            .attach('file', filePath1);
        user1.fileKey1 = response.body.files[1].storedFileName;
    });

    it("deletion fails when attepmted agaist not user's note", async () => {

        // GIVEN:
        const endpoint = `/notes/${user2.note1}/files/${user1.fileKey0}`;
        const accessToken = user1.accessToken;

        // WHEN:
        let response = await request
            .delete(endpoint)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(403);
        expect(response.body.message).includes(errors.note.NOT_USERS_NOTE);
    });

    it("deletion successful", async () => {

        // GIVEN:
        const endpoint = `/notes/${user1.note1}/files/${user1.fileKey0}`;
        const accessToken = user1.accessToken;

        // WHEN:
        let response = await request
            .delete(endpoint)
            .set("Authorization", `Bearer ${accessToken}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.files.length).to.eql(1);
        expect(response.body.files[0].originalFileName).to.not.eql('Thank_You_Kitty.png');
        expect(response.body.files[0].storedFileName).to.not.eql(user1.fileKey0);

        // WHEN:
        response = await requestS3.get('/' + user1.fileKey0);

        // THEN:
        expect(response.status).to.eql(403);
    });
});

describe('Public content', () => {

    it("successful public profile retrieval", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-one';

        // WHEN:
        const response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body).to.not.include.any.keys('password', 'refreshToken', 'isAdmin');
        expect(response.body.isPublic).to.be.true;
        expect(response.body.email).to.eql('mocha-one@test.com');
        expect(response.body.profileName).to.eql('mocha-one');
        expect(response.body.firstName).to.eql('MJ');
        expect(response.body.lastName).to.eql('Felix');
        expect(response.body.linkedIn).to.eql('https://www.linkedin.com/in/mjfelix/');
        expect(response.body.twitter).to.eql('https://twitter.com/mjfelixdev');
        expect(response.body.gitHub).to.eql('https://github.com/mj-felix');
        expect(response.body.homepage).to.eql('https://mjfelix.dev');
        expect(response.body.bio).to.eql('Tech BA turned Dev :-)');
        expect(response.body.location).to.eql('Wellington, NZ');
        expect(response.body.publicNotesExist).to.be.true;
    });

    it("failed non-public profile retrieval", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-two';

        // WHEN:
        const response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.isPublic).to.be.false;
        expect(response.body.publicNotesExist).to.be.false;
        expect(response.body.profileName).to.eql('mocha-two');
    });

    it("successful public note retrieval", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-one/notes/' + user1.note1;

        // WHEN:
        const response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.isSticky).to.be.true;
        expect(response.body.isPublic).to.be.true;
        expect(response.body.tags[0]._id).to.eql(user1.tag1);
        expect(response.body.madePublicAt).includes('2021-11-25');
        expect(response.body.user.isPublic).to.be.true;
        expect(response.body.user.profileName).to.eql('mocha-one');
        expect(response.body.files[0].storedFileName).to.eql(user1.fileKey1);
    });

    it("failed non-public note retrieval", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-two/notes/' + user2.note1;

        // WHEN:
        const response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(404);
        expect(response.body.message).includes(errors.note.NOT_FOUND);
    });

    it("failed public notes retrieval when user has no public notes", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-two/notes/';

        // WHEN:
        const response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(0);
        expect(response.body.notesCount).to.eql(0);
        expect(response.body.page).to.eql(1);
        expect(response.body.pageSize).to.eql(10);
        expect(response.body.pages).to.eql(0);
    });

    it("successful public notes retrieval (inc. order, search and pagination)", async () => {

        // GIVEN:
        const endpoint = '/public/mocha-one/notes/';

        // WHEN:
        let response = await request.get(endpoint);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(3);
        expect(response.body.notesCount).to.eql(3);
        expect(response.body.page).to.eql(1);
        expect(response.body.pageSize).to.eql(10);
        const noteIds = response.body.notes.map(note => note._id);
        expect(noteIds).to.not.include(user1.note0);
        expect(noteIds).to.not.include(user1.note4);
        expect(noteIds).to.not.include(user2.note1);
        expect(noteIds).to.have.ordered.members([user1.note1, user1.note3, user1.note2]);
        expect(response.body.notes[0].files.storedFileName).to.eql(user1.keyFile1);

        // S3 teardown
        // GIVEN:
        const endpointS3teardown = `/notes/${user1.note1}/files/${user1.fileKey1}`;
        const accessToken = user1.accessToken;
        response = await request
            .delete(endpointS3teardown)
            .set("Authorization", `Bearer ${accessToken}`);

        // WHEN:
        response = await request
            .get(`${endpoint}?pageSize=2&page=2&tags=${user1.tag1}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(1);
        expect(response.body.notesCount).to.eql(3);
        expect(response.body.page).to.eql(2);
        expect(response.body.pageSize).to.eql(2);
        expect(response.body.pages).to.eql(2);
        expect(response.body.notes[0]._id).to.eql(user1.note2);

        // WHEN:
        response = await request
            .get(`${endpoint}?pageSize=5&page=1&search=note%203&tags=${user1.tag2}`);

        // THEN:
        expect(response.status).to.eql(200);
        expect(response.body.notes.length).to.eql(2);
        expect(response.body.notesCount).to.eql(2);
        expect(response.body.page).to.eql(1);
        expect(response.body.pageSize).to.eql(5);
        expect(response.body.pages).to.eql(1);
        expect(response.body.notes.map(note => note._id))
            .to.have.ordered.members([user1.note3, user1.note2]);
    });
});