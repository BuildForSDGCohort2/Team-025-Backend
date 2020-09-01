const mongoose = require('mongoose');

var hospitalSchema = new mongoose(
{
	name:{
		type: String
		required: true
	},
	city{
		type: String,
		required: true
	},
	address{
		type: String,
		required: true
	},
	phone{
		type: String,
		required: true
	},
	email{
		type: String,
		required: true
	}


})