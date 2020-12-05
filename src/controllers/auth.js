const User   = require('../models/User')
const bcrypt = require('bcrypt')
const jwt    = require('jsonwebtoken')

const {validationResult} = require('express-validator')

exports.register = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return res.status(400).json({
		status: res.statusCode,
		message: 'Invalid value !',
		data: errors.array(),
	})

	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(req.body.password, salt)

	const userRequest = new User({
		name: req.body.name,
		username: req.body.name,
		email: req.body.email,
		password: hash,
	})

	await userRequest.save()
	.then(result => {
		res.status(200).json({
			message: true,
			data: result
		})
	})
	.catch(err => {
		next(err)
	})
}

exports.login = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return res.status(400).json({
		status: res.statusCode,
		message: 'Invalid value !',
		data: errors.array(),
	})

	const user = await User.findOne({email: req.body.email})

	// If email registered
	if (!user) return res.status(400).json({
		status: res.statusCode,
		message: 'Email failed !'
	})

	// Check password
	const password = await bcrypt.compare(req.body.password, user.password)
	if (!password) return res.status(400).json({
		status: res.statusCode,
		message: 'Password failed !'
	})

	const token = jwt.sign({_id: user._id}, process.env.SECRET_KEY)
	res.header({
		'Content-Type': 'application/json',
		'Authorization': token
	}).json({
		message: true,
		data: {
			'Content-Type': 'application/json',
			'Authorization': token
		}
	})
}
