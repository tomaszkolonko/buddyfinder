var Boom = require('boom')
var Bcrypt = require('bcrypt')
var Users = require('../users-db')

// const db = server.app.db;

var routes = [
    {
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
    },
    {
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

                console.log("***" + username);

                var user = Users[ username ];
                console.log("from DB: " + user);

                if (!user) {
                    return reply(Boom.notFound('No user registered with given credentials'))
                }

                var password = request.payload.password

                return Bcrypt.compare(password, user.password, function (err, isValid) {
                    if (isValid) {
                        request.server.log('info', 'user authentication successful')
                        request.cookieAuth.set(user);
                        return reply('is authenticated already... -> profile (/ GET from bcrypt)')
                    }

                    reply('Not yet authenticated... -> index')
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/logout',
        config: {
            auth: 'session',
            handler: function (request, reply) {
                request.cookieAuth.clear();
                reply('No more authenticated... -> index')
            }
        }
    }
]

module.exports = routes