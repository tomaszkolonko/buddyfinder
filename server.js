'use strict';

const Hapi = require('hapi');
const Good = require('good');
const mongojs = require('mongojs');

const BasicAuth = require('hapi-auth-basic');
const Bcrypt = require('bcrypt');

const mongoDBconnectionURL = "mongodb://Jonny:TheFearless@ds237475.mlab.com:37475/buddyfinder";

const server = new Hapi.Server();
server.connection({port : process.env.PORT ||3000 });

const collections = ['activity', 'users'];
server.app.db = mongojs(mongoDBconnectionURL, collections);  //<--- Added

server.app.db.on('error', function(err) {
    console.log('database error', err)
});

server.app.db.on('connect', function() {
    console.log('successfully connected to buddyfinder DB')
});

// make the db accessible from everywhere whitin this application
server.bind({ db: server.app.db });

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
},
    require('inert'),
    require('hapi-auth-basic')], (err) => {
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

    server.route(require('./routes/activities'));
    server.route(require('./routes/users'));

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