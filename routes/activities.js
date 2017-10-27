'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

exports.register = function (server, options, next) {

    const db = server.app.db;

    server.route({
        method: 'GET',
        path: '/activities',
        handler: function (request, reply) {
            console.log("inside /activities GET");

            db.activity.find((err, docs) => {

                if (err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }

                reply(docs);
            });

        }
    });

    server.route({
        method: 'GET',
        path: '/activities/{name}',
        handler: function (request, reply) {
            console.log("inside /activities/{name} GET");

            db.activity.findOne({
                name: request.params.name
            }, (err, doc) => {
                if(err) {
                    return reply(Boom.wrap(err, 'Internal MongoDB error'));
                }
                if(!doc) {
                    return reply(Boom.notFound());
                }
                reply(doc);
            });
        }
    });

    server.route({
        method: 'POST',
        path: '/activities',
        handler: function (request, reply) {
            const activity = request.payload;

            console.log("inside /activities POST");
            //Create a new activity
            activity._id = uuid.v1();

            db.activity.save(activity, (err, result) => {
                if(err) {
                    return reply(Boom.wrapper(err, 'Internal MongoDB error'));
                }
                reply(activity);
            });
        }
    });

    return next();
};

exports.register.attributes = {
    name: 'routes-activities'
};