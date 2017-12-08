'use strict';

const Activities = require('../handlers/activities');

const Joi = require('joi');

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
    handler: Activities.createOne
}];
