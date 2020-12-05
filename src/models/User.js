const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		max: 100
	},
	username: {
		type: String,
		required: true,
		max: 100
	},
	email: {
		type: String,
		required: true,
		max: 100
	},
	password: {
		type: String,
		required: true,
		min: 6,
		max: 1024
	},
	address: {
		type: String,
		default: null
	},
	photo: {
		type: String,
		default: null
	},
	user_id: {
		type: Object,
		default: null
	}
}, {
	timestamps: true
})

module.exports = mongoose.model('User', UserSchema)