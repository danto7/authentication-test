/// <reference path="../typings/mongoose/mongoose.d.ts" />

var mongoose = require('mongoose')

module.exports = new mongoose.Schema({
	email: String,
	name: String,
	password: String,
	profilePicture: String,
	isAdmin: Boolean
});