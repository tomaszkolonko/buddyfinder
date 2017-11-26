'use strict';
const Hapi = require('hapi');
const Good = require('good');
const mongojs = require('mongojs');
const Joi = require('joi');
const Boom = require('boom');
const Bcrypt = require('bcrypt');
var CookieAuth = require('hapi-auth-cookie');

const mongoDBconnectionURL = "mongodb://Jonny:TheFearless@ds237475.mlab.com:37475/buddyfinder";
var port = parseInt(process.env.PORT);
console.log(port);
console.log("**************");

// first iteration of authentication against hardcoded user
var users = {
    future: {
        id: '1',
        email: 'test@test.ch',
        username: "future",
        password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
    }
};

const server = new Hapi.Server();
server.connection({port : process.env.PORT ||3000 });
//server._port = port;
//server.start();
//server.connection({host: 'https://blooming-fortress-94706.herokuapp.com/'})

const collections = ['activity', 'users'];
server.app.db = mongojs(mongoDBconnectionURL, collections);  //<--- Added

server.app.db.on('error', function(err) {
    console.log('database error', err)
});

server.app.db.on('connect', function() {
    console.log('successfully connected to buddyfinder DB')
});

/*
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Some welcome Screen -> index.html or whatever');
    }
});

server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: function (request, reply) {
        reply('Retrieving ' + encodeURIComponent(request.params.name) + '\'s public profile!');
    }
});
*/

// REGISTER ALL PLUGINS WITH SERVER
server.register([
    {
        register: Good,
        options: {
            reporters: {
                console: [{
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{
                        response: '*',
                        log: '*'
                    }]
                }, {
                    module: 'good-console'
                }, 'stdout']
            }
        }
    },
    {
      register: CookieAuth
    },
        require('inert'),
    ], (err) => {
    if(err) {
        throw err;
    }

    // validation function used for hapi-auth-cookie: optional and checks if the user is still existing
    var validation = function (request, session, callback) {
        var username = session.username;
        var user = Users[ username ];

        if (!user) {
            return callback(null, false)
        }

        server.log('info', 'user authenticated');
        callback(err, true, user)
    };

    server.auth.strategy('session', 'cookie', true, {
        password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
        cookie: 'bf-buddy-finder-application',
        redirectTo: '/',
        isSecure: false,
        validateFunc: validation
    });
    server.log('info', 'Registered auth strategy: cookie auth');


    var login_route = require('./routes/login');
    server.route(login_route);

    server.log('info', 'Routes registered');

    server.start((err) => {
        if(err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});