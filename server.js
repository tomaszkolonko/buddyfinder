'use strict';

const Hapi = require('hapi');
const Good = require('good');
const mongojs = require('mongojs');

const BasicAuth = require('hapi-auth-basic');
const Bcrypt = require('bcrypt');

const mongoDBconnectionURL = "mongodb://Jonny:TheFearless@ds237475.mlab.com:37475/buddyfinder";
var port = parseInt(process.env.PORT);
console.log(port);
console.log("**************");

// first iteration of authentication against hardcoded user
var users = {
    future: {
        id: '1',
        username: 'future',
        password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
    }
}


const server = new Hapi.Server();
server.connection({port : process.env.PORT ||3000 });
//server._port = port;
//server.start();
//server.connection({host: 'https://blooming-fortress-94706.herokuapp.com/'})

const collections = ['activity'];
server.app.db = mongojs(mongoDBconnectionURL, collections);  //<--- Added

server.app.db.on('error', function(err) {
    console.log('database error', err)
});

server.app.db.on('connect', function() {
    console.log('successfully connected to buddyfinder DB')
});

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



server.register([{
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
}, require('./routes/activities'), require('inert'), require('hapi-auth-basic')], (err) => {
    if(err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function(request, reply) {
            reply.file('./public/hello.html');
        }
    });

    // validation function used for hapi-auth-basic
    var basicValidation  = function (request, username, password, callback) {
        var user = users[ username ];

        if (!user) {
            return callback(null, false);
        }

        Bcrypt.compare(password, user.password, function (err, isValid) {
            callback(err, isValid, { id: user.id, username: user.username })
        })
    };


    server.auth.strategy('simple', 'basic', { validateFunc: basicValidation });

    server.route({
        method: 'GET',
        path: '/private-route',
        config: {
            auth: 'simple',
            handler: function (request, reply) {
                reply('Yeah! This message is only available for authenticated users!')
            }
        }
    });

    server.start((err) => {
        if(err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});


server.register