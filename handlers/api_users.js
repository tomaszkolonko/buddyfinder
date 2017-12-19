'use strict';

const Bcrypt = require('bcrypt-nodejs');
const Boom = require('boom');
const uuid = require('node-uuid');
const JSONWebToken = require('jsonwebtoken');

/**
 * Gets the public profile of a user
 *
 * @param request
 * @param reply
 *
 * @returns stub...
 */
exports.getOne = function (request, reply) {
    // TODO: needs a public profile page !!!
    reply('Retrieving ' + encodeURIComponent(request.params.name) + '\'s public profile!');
};

/**
 * Authenticates the user and creates a session token on the client
 *
 * @param request
 * @param reply
 *
 * @returns JSON object of user token
 */
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

/**
 * Register a new user
 *
 * @param request.payload needs to be the JSON object of a user.
 * @param reply
 *
 * @returns JSON object of the newly created user
 */
exports.register = function (request, reply) {
    const user = request.payload;

    const token = JSONWebToken.sign({ token: user.name }, 'AppleCrazyFudgeFortressOverTheLamb');
    user["token"] = token;

    // never ever save a password in cleartext
    // TODO: think about salting the password for better security
    Bcrypt.hash(user.password, null, null, (err, hash) => {
        if(err) {
            throw err;
        }
        user["password"] = hash;

        user._id = uuid.v1();

        this.db.users.save(user, (err, result) => {
            if(err) {
                return reply(Boom.wrapper(err, 'Internal MongoDB error'));
            }
            reply(user);
        });
    });
};