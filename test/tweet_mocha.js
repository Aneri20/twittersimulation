/**
 * Created by haneri on 20-03-2016.
 */

var request  = require('request')
    ,express = require('express')
    ,assert = require("assert")
    ,http = require("http");

describe('http tests', function(){

    it('display signup page if url is correct', function(done){
        http.get('http://localhost:3000/', function(res) {
            assert.equal(200, res.statusCode);
            done();
        })
    });

    it('should not display the home page if url is incorrect', function(done){
        http.get('http://localhost:3000/home', function(res) {
            assert.equal(404, res.statusCode);
            done();
        })
    });

    it(' display login', function(done) {
        request.post(
            'http://localhost:3000/afterSignIn',
            { form: { user_name: 's',password:'s' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });

    it('display home page', function(done) {
        request.get(
            'http://localhost:3000/login',
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
    it('fetch tweets on home page load ', function(done) {
        request.post(
            'http://localhost:3000/add_details',
            { form: { email : 's@s.com', password:'s', full_name:'s' } },
            function (error, response, body) {
                assert.equal(200, response.statusCode);
                done();
            }
        );
    });
});
