'use strict';

const uuid = require('node-uuid');

exports.getOne = function (request, reply) {
    reply('Retrieving ' + encodeURIComponent(request.params.name) + '\'s public profile!');
};