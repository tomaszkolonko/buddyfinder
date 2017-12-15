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
    path: '/activities/{_id}/star',
    handler: WebActivities.starIt,
    config: {
        auth: {
            mode: 'required'
        }
    }
}];