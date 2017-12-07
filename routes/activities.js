'use strict';

const Boom = require('boom');
const uuid = require('node-uuid');
const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/activities',
    handler: function (request, reply) {
        console.log("inside /activities GET");

        this.db.activity.find((err, docs) => {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            reply(docs);
        });

    }
}, {
    method: 'GET',
    path: '/activities/{name}',
    handler: function (request, reply) {
        console.log("inside /activities/{name} GET");

        this.db.activity.findOne({
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
}, {
    method: 'POST',
    path: '/activities',
    handler: function (request, reply) {
        const activity = request.payload;

        console.log("inside /activities POST");
        //Create a new activity
        activity._id = uuid.v1();

        this.db.activity.save(activity, (err, result) => {
            if(err) {
                return reply(Boom.wrapper(err, 'Internal MongoDB error'));
            }
            reply(activity);
        });
    }
}];
