'use strict';

const uuid = require('node-uuid');
const Boom = require('boom');
const Wreck = require('wreck');

const MongoClient = require('mongodb').MongoClient;

/**
 * Finds all activities
 *
 * @param request
 * @param reply
 *
 * @returns JSON object of all activities
 */
exports.getAll = function (request, reply) {

    this.db.activity.find((err, docs) => {

        if (err) {
            return reply(Boom.badData(err, 'Internal MongoDB error'));
        }

        reply(docs);
    });
};

/**
 * Finds one specific activity by _id and returns it as a JSON object
 *
 * @param request
 * @param request.params.name needs to be the activities _id
 * @param reply
 *
 * @returns JSON object of specified activity
 */
exports.getOne = function (request, reply) {

    this.db.activity.findOne({_id: request.params.name}, (err, doc) => {
        if(err) {
            return reply(Boom.badData(err, 'Internal MongoDB error'));
        }
        if(!doc) {
            return reply(Boom.notFound());
        }
        reply(doc);
    });
};

/**
 * Creates a new activity that is handed in the request payload. _id is generated
 * by this method.
 *
 * @param request
 * @param request.payload needs to be a full activity in JSON format from form
 * @param reply
 *
 * @returns JSON of new activity
 */
exports.createOne = function (request, reply) {
    const activity = request.payload;

    // creates a new _id for the activity and sets the popularity to a
    // starting value of 0
    activity._id = uuid.v1();
    activity.popularity = 0;

    this.db.activity.save(activity, (err, result) => {
        if(err) {
            return reply(Boom.wrapper(err, 'Internal MongoDB error'));
        }
        reply(activity);
    });
};

/**
 * Adds one start to specified activity
 *
 * @param request
 * @param request.params._id needs to specifiy the activity
 * @param request.payload.userToken needs the token of the user
 * @param reply
 *
 * @returns JSON of upvoted activity
 */
exports.upvoteActivity = function (request, reply) {

    this.db.users.findOne({token: request.payload.userToken}, (err, user) => {
       if (err) {
           // TODO: does not display if it happens.... it goes to reply(doc) furhter down ;(
           return reply(Boom.badData(err, 'Internal MongoDB error'));
       }
       if(!user) {
            return reply(Boom.notFound());
       }

        this.db.activity.findOne({_id: request.params._id}, (err, activity) => {
            if (err) {
                // TODO: does not display if it happens.... it goes to reply(doc) furhter down ;(
                return reply(Boom.badData(err, 'Internal MongoDB error'));
            }
            if(!user) {
                return reply(Boom.notFound());
            }

            // check if user is within activity upvoted array
            let userArrayUpVotedBy = activity.upvotedBy;
            let alreadyUpVoted = false;


            if(userArrayUpVotedBy !== undefined) {
                for(let i = 0; i < userArrayUpVotedBy.length; i++) {
                    if(userArrayUpVotedBy[i].userID === user._id) {
                        alreadyUpVoted = true;
                    }
                }
            }

            // check if user is within activity downvoted array
            let userArrayDownVotedBy = activity.downvotedBy;
            let alsoDownVoted = false;

            if(userArrayDownVotedBy !== undefined) {
                for(let i = 0; i < userArrayDownVotedBy.length; i++) {
                    if(userArrayDownVotedBy[i].userID === user._id) {
                        alsoDownVoted = true;
                    }
                }
            }


            if(alreadyUpVoted) {
                reply({message: "already upvoted"});
            } else if(alsoDownVoted) {
                this.db.activity.update({_id: request.params._id},
                    {$inc: {popularity: 2}, $push: {"upvotedBy": {"userID": user._id}},
                                            $pull: {"downvotedBy": {"userID": user._id}}}, (err, changedActivity) => {
                        if(err) {
                            // TODO: does not display if it happens.... it goes to reply(doc) furhter down ;(
                            return reply(Boom.badData(err, 'Internal MongoDB error'));

                        }
                        if(!changedActivity) {
                            return reply(Boom.notFound());
                        }

                        reply(changedActivity);
                    });
            } else {
                this.db.activity.update({_id: request.params._id},
                    {$inc: {popularity: 1}, $push: {"upvotedBy": {"userID": user._id}}}, (err, changedActivity) => {
                        if (err) {
                            // TODO: does not display if it happens.... it goes to reply(doc) furhter down ;(
                            return reply(Boom.badData(err, 'Internal MongoDB error'));

                        }
                        if (!changedActivity) {
                            return reply(Boom.notFound());
                        }

                        reply(changedActivity);
                    });
            }


        });


    });
};

/**
 * Removes a star from specified activity
 *
 * @param request
 * @param request.params._id needs to specifiy the activity
 * @param request.payload.userToken needs the token of the user
 * @param reply
 *
 * @returns JSON of downvoted activity
 */
exports.downvoteActivity = function (request, reply) {

    this.db.users.findOne({token: request.payload.userToken}, (err, user) => {
        if (err) {
            // TODO: does not display if it happens.... it goes to reply(doc) furhter down ;(
            return reply(Boom.badData(err, 'Internal MongoDB error'));
        }
        if (!user) {
            return reply(Boom.notFound());
        }
        this.db.activity.findOne({_id: request.params._id}, (err, activity) => {
            if(err) {
                return reply(Boom.badData(err, 'Internal MongoDB error'));
            }
            if(!activity) {
                return reply(Boom.notFound());
            }

            // check if user is within activity downvoted array
            let userArrayDownVotedBy = activity.downvotedBy;
            let alreadyDownVoted = false;


            if(userArrayDownVotedBy !== undefined) {
                for(let i = 0; i < userArrayDownVotedBy.length; i++) {
                    if(userArrayDownVotedBy[i].userID === user._id) {
                        alreadyDownVoted = true;
                    }
                }
            }

            // check if user is within activity upvoted array
            let userArrayUpVotedBy = activity.upvotedBy;
            let alsoUpVoted = false;

            if(userArrayUpVotedBy !== undefined) {
                for(let i = 0; i < userArrayUpVotedBy.length; i++) {
                    if(userArrayUpVotedBy[i].userID === user._id) {
                        alsoUpVoted = true;
                    }
                }
            }


            if(alreadyDownVoted) {
                reply({message: "already downvoted"});
            } else if(alsoUpVoted) {
                let decrementedPopularity = activity.popularity > 0 ? activity.popularity-2 : 0;

                this.db.activity.update({_id: request.params._id}, {$set: {popularity: decrementedPopularity},
                                            $push: {"downvotedBy": {"userID": user._id}},
                                            $pull: {"upvotedBy": {"userID": user._id}}}, (err, activity) => {
                    if(err) {
                        return reply(Boom.badData(err, 'Internal MongoDB error'));
                    }
                    if(!activity) {
                        return reply(Boom.notFound());
                    }

                    reply(activity);
                });
            } else {
                let decrementedPopularity = activity.popularity > 0 ? activity.popularity-1 : 0;

                this.db.activity.update({_id: request.params._id}, {$set: {popularity: decrementedPopularity},
                                            $push: {"downvotedBy": {"userID": user._id}}}, (err, activity) => {
                    if(err) {
                        return reply(Boom.badData(err, 'Internal MongoDB error'));
                    }
                    if(!activity) {
                        return reply(Boom.notFound());
                    }

                    reply(activity);
                });
            }
        });

    });


};

/**
 * Signs up the user for an activity
 *
 * @param request
 * @param request.payload.userToken needs to have the token of currently logged in user
 * @param request.params._id needs to have the _id of the activity for sign up
 * @param reply
 *
 * @returns JSON object of the activity the user signed up for
 */
exports.signUp = function (request, reply) {
    // FIXME: There are two ways how the DB is connected to, mongojs was chosen at first but
    // FIXME: couldn't solve this problem here...
    // TODO: refactor this method.
    // Connect to the db
    MongoClient.connect("mongodb://Jonny:TheFearless@ds237475.mlab.com:37475/buddyfinder", function (err, db) {
        if(err) {
            throw err;
        }

        db.collection('users', (err, collection) => {
            if(err) {
                throw err;
            }

            collection.findOne({token: request.payload.userToken}, (err, user) => {
                if(err) {
                    throw err;
                }
                const name = user.username + "_" + user._id.substring(0,2);
                const email = user.email;

                db.collection('activity', (err, collection) => {
                    if(err) {
                        throw err;
                    }

                    collection.update({_id: request.params._id}, {$push: {"users": {"user": name,
                                                                                    "id" : user._id,
                                                                                    "email": user.email,
                                                                                    "token": user.token}}},
                        (err, activity) => {
                            if (err) {
                                throw err;
                            }
                            reply(activity);
                        }
                    )
                })
            });
        });

    });
};

/**
 * Signs off the user from an activity
 *
 * @param request
 * @param request.payload.userToken needs to have the token of currently logged in user
 * @param request.params._id needs to have the _id of the activity for sign off
 * @param reply
 *
 * @returns JSON object of the activity the user signed off
 */
exports.signOff = function (request, reply) {
    // FIXME: There are two ways how the DB is connected to, mongojs was chosen at first but
    // FIXME: couldn't solve this problem here...
    // TODO: refactor this method.
    // Connect to the db
    MongoClient.connect("mongodb://Jonny:TheFearless@ds237475.mlab.com:37475/buddyfinder", function (err, db) {
        if(err) {
            throw err;
        }

        db.collection('users', (err, collection) => {
            if(err) {
                throw err;
            }

            collection.findOne({token: request.payload.userToken}, (err, user) => {
                if(err) {
                    throw err;
                }
                const name = user.username + "_" + user._id.substring(0,2);
                const email = user.email;

                db.collection('activity', (err, collection) => {
                    if(err) {
                        throw err;
                    }

                    collection.update({_id: request.params._id}, {$pull: {"users": {"user": name,
                            "email": user.email,
                            "token": user.token}}},
                        (err, activity) => {
                            if (err) {
                                throw err;
                            }
                            reply(activity);
                        }
                    )
                })
            });
        });

    });
};