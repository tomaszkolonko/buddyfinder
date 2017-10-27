'use strict';

const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

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

server.route({
    method: 'GET',
    path: '/activity',
    handler: function(request, reply) {
        reply('Retrieving a list of all activities...')
    }
})

server.route({
    method: ['PUT'],
    path: '/activity',
    handler: function (request, reply) {
        reply('Adding new activites...')
    }
});

server.route({
    method: ['POST'],
    path: '/activity/{activityString}/whoelse',
    handler: function (request, reply) {
        reply('Retrieving list of interested users in ' + encodeURIComponent(request.params.activityString) + ' ...')
    }
});

server.route({
    method: ['PUT'],
    path: '/activity/{activityString}',
    handler: function(request, reply) {
        reply('Adding ' + encodeURIComponent(request.params.activityString) + ' to activites')
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

server.register({
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
}, (err) => {
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