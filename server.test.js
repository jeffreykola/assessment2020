const request = require('supertest');
const server = require("./server");

describe('Tests for server.js', () => {
    test('GET data for Programming module', () => {
        return request(server)
	    .get('/data?id=Programming')
        .expect(200);
    });


    test('GET / for all subjects', () => {
        return request(server)
        .get('/subjects')
        .expect(200);
    });

    test('GET / for checking the existence of a module', () => {
        return request(server)
        .get('/search?search=Maths')
        .expect('Content-Type',/json/);
    });

    test('POST /data requires body and not found', () => {
        return request(server)
	    .post('/data')
	    .expect(404);
    });

});