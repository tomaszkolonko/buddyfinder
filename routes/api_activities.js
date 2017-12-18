'use strict';

const ApiActivities = require('../handlers/api_activities');

module.exports = [{
    method: 'GET',
    path: '/api/activities',
    handler: ApiActivities.getAll
}, {
    method: 'GET',
    path: '/api/activities/{name}',
    handler: ApiActivities.getOne
}, {
    method: 'POST',
    path: '/api/activities',
    handler: ApiActivities.createOne,
    config: {
        auth: 'api'
    }
}, {
    method: 'POST',
    path: '/api/activities/{_id}/upvoteActivity',
    handler: ApiActivities.upvoteActivity,
    config: {
        auth: 'api'
    }
}, {
    method: 'POST',
    path: '/api/activities/{_id}/downvoteActivity',
    handler: ApiActivities.downvoteActivity,
    config: {
        auth: 'api'
    }
}, {
    method: 'POST',
    path: '/api/activities/{_id}/signUp',
    handler: ApiActivities.signUp,
    config: {
        auth: 'api'
    }
}];
