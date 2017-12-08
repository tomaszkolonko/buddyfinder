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

server.bind({
    apiBaseUrl: 'http://localhost:3000/api',
    webBaseUrl: 'http://localhost:3000',
    db: server.app.db
});


const validateFunc = function (token, callback) {

    server.app.db.users.findOne({
        token: token
    }, (err, doc) => {
        if(err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }
        callback(null, true, {
            id: doc.id,
            username: doc.username
        });
    });
};

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
    //require('hapi-auth-basic'),
    require('hapi-auth-bearer-token'),
    require('vision'),
    require('hapi-auth-cookie')], (err) => {
    if(err) {
        throw err;
    }

    server.auth.strategy('api', 'bearer-access-token', {
        validateFunc: validateFunc
    });
    server.auth.strategy('session', 'cookie', 'try', {
        password: '70fe4f26ff9bcb5aab079875cadeec09',
        isSecure: false
    });
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './views',
        layoutPath: './views/layout',
        layout: true,
        isCached: false,
        helpersPath: './views/helpers',
        partialsPath: './views/partials'
    });

    server.route(require('./routes/api_activities'));
    server.route(require('./routes/api_users'));
    server.route(require('./routes/pages'));



    server.start((err) => {
        if(err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});