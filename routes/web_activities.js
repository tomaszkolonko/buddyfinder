'use strict';

const WebActivities = require('../handlers/web_activities');
const Actions = require('../handlers/actions');
const Joi = require('joi');

module.exports = [{
    method: 'GET',
    path: '/create',
    handler: WebActivities.createActivity,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/create',
    handler: Actions.createActivity,
    config: {
        auth: {
            mode: 'required'
        },
        validate: {
            payload: {
                name: Joi.string().required(),
                description: Joi.string().required(),
                location: Joi.string().required(),
                date: Joi.string().required(),
                time: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function (request, reply, source, error) {
                const errors = {};
                const details = error.data.details;
                for(let i = 0; i < details.length; ++i) {
                    if(!errors.hasOwnProperty(details[i].path)) {
                        errors[details[i].path] = details[i].message;
                    }
                }
                reply.view('create', {
                    errors: errors,
                    values: request.payload,
                    user: request.auth.credentials
                }).code(400);
            }
        }

    }
}, {
    method: 'GET',
    path: '/activities/{_id}',
    handler: WebActivities.getOne,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/activities/{_id}/upvoteActivity',
    handler: WebActivities.upvoteActivity,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/activities/{_id}/downvoteActivity',
    handler: WebActivities.downvoteActivity,
    config: {
        auth: {
            mode: 'required'
        }
    }
}, {
    method: 'POST',
    path: '/activities/{_id}/signUp',
    handler: WebActivities.signUp,
    config: {
        auth: {
            mode: 'required'
        }
    }
}];