'use strict';

const Bcrypt = require('bcrypt-nodejs');
const Boom = require('boom');

exports.getOne = function (request, reply) {
    reply('Retrieving ' + encodeURIComponent(request.params.name) + '\'s public profile!');
};

exports.login = function (request, reply) {

    this.db.users.findOne({
        username: request.payload.username
    }, (err, doc) => {
        if(err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }

        const user = doc;

        Bcrypt.compare(request.payload.password, user.password, (err, res) => {

            if (err) {
                throw err;
            }

            if (!res) {
                return reply('Not authorized').code(401);
            }

            reply({
                token: user.token
            });
        });
    });
};