/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
	userId: String,
	created: {type: Date, default: Date.now },
	lastAccess: {type: Date, default: Date.now}
});