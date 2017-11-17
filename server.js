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

// inert is a plugin that will serve static webpages
server.register(require('inert'), (err) => {
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
}, require('./routes/activities')], (err) => {
    if(err) {
        throw err;
    }

    server.start((err) => {
        if(err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

server.register