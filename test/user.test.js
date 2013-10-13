var request = require('supertest');
var api = request('http://localhost:3003/1.0');
var expect = require('chai').expect;

describe('User', function() {
    describe('log in user', function() {
        it('should stub the auth middleware', function(done) {
            api.post('/auth/login')
                .end(function(err, res) {
                    expect(res.body.email).to.equal('james.nocentini@gmail.com');
                    done();
                })
        })
    })
})