'use strict';

const Activities = require('../handlers/api_activities');

module.exports = [{
    method: 'GET',
    path: '/api/activities',
    handler: Activities.getAll
}, {
    method: 'GET',
    path: '/api/activities/{name}',
    handler: Activities.getOne
}, {
    method: 'POST',
    path: '/api/activities',
    config: {
        auth: 'api'
    },
    handler: Activities.createOne
}];
