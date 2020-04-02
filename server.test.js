const request = require('supertest');
const server = require("./server");

describe('Tests for server.js', () => {
    test('GET data for Programming module', () => {
        return request(server)
	    .get('/data?id=Programming')
        .expect(200);
});


test('GET /data for missing module', () => {
    return request(server)
    .get('/data?id=Geography')
    .expect(400);
});


});