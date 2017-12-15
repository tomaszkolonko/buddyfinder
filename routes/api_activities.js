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
    config: {
        auth: 'api'
    },
    handler: ApiActivities.createOne
}, {
    method: 'POST',
    path: '/api/activities/{_id}/star',
    handler: ApiActivities.starIt
}];
