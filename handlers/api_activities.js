'use strict';

const uuid = require('node-uuid');
const Boom = require('boom');
const Wreck = require('wreck');

exports.getAll = function (request, reply) {

    this.db.activity.find((err, docs) => {

        if (err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }

        reply(docs);
    });
};

exports.getOne = function (request, reply) {

    this.db.activity.findOne({_id: request.params.name}, (err, doc) => {
        if(err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }
        reply(doc);
    });
};

exports.createOne = function (request, reply) {
    const activity = request.payload;

    //Create a new activity
    activity._id = uuid.v1();

    this.db.activity.save(activity, (err, result) => {
        if(err) {
            return reply(Boom.wrapper(err, 'Internal MongoDB error'));
        }
        reply(activity);
    });
};

exports.upvoteActivity = function (request, reply) {

    this.db.activity.update({_id: request.params._id}, {$inc: {popularity: 1}}, (err, doc) => {
        if(err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }

        reply(doc);
    });
};
exports.downvoteActivity = function (request, reply) {

    this.db.activity.findOne({_id: request.params._id}, (err, doc) => {
        if(err) {
            return reply(Boom.wrap(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }
        var decrementedPopularity = doc.popularity > 0 ? doc.popularity-1 : 0;

        this.db.activity.update({_id: request.params._id}, {$set: {popularity: decrementedPopularity}}, (err, doc) => {
            if(err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
            if(!doc) {
                return reply(Boom.notFound());
            }

            reply(doc);
        });

    });


};
