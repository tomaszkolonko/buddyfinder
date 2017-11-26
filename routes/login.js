var Boom = require('boom')
var Bcrypt = require('bcrypt')
var Users = require('../users-db')


exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply('is authenticated already... -> profile (/ GET)')
                }

                reply('Not yet authenticated... -> index')
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/',
        config: {
            auth: {
                mode: 'try'
            },
            plugins: {
                'hapi-auth-cookie': {
                    redirectTo: false
                }
            },
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply('is authenticated already... -> profile (POST /)');
                }

                var username = request.payload.username;
                var password = request.payload.password; // TZ_to be deleted afterwards

                console.log("*** " + username);
                console.log("*** " + password);

                db.users.find({username: username}, function(err, docs) {

                    if (err) {
                        return reply(Boom.wrap(err, 'Internal MongoDB error'));
                    }
                    console.log("______________");
                    console.dir(docs);
                    console.dir(docs[0]);
                    if (!docs[0]) {
                        return reply(Boom.notFound('No user registered with given credentials'))
                    }

                    Bcrypt.compare(password, docs[0].password, function (err, isValid) {
                        if (isValid) {
                            request.server.log('info', 'user authentication successful')
                            request.cookieAuth.set(docs[0]);
                            return reply('is authenticated now... -> profile (/ GET from bcrypt)')
                        }

                        reply('wrong password... -> index')
                    });
                });
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'session',
            handler: function (request, reply) {
                request.cookieAuth.clear();
                reply('No more authenticated... -> index')
            }
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-login'
};
