const User   = require('../models/User')
const multer = require('multer')
const bcrypt = require('bcrypt')
const path   = require('path')
const fs     = require('fs')

const {validationResult} = require('express-validator')


exports.userIndex = async (req, res, next) => {
	const currentPage = req.query.page || 1;
	const perPage = req.query.perPage || 10;
	let totalItems;

	await User.find()
	.countDocuments()
	.then(count => {
		totalItems = count
		return User.find()
		.skip((parseInt(currentPage) - 1) * parseInt(perPage))
		.limit(parseInt(perPage))
	})
	.then(result => {
		res.status(200).json({
			status: res.statusCode,
			message: 'success',
			data: result,
			total: totalItems,
			per_page: parseInt(perPage),
			current_page: parseInt(currentPage),
		})
	})
	.catch(err => {
		next(err)
	})
}

exports.userShow = async (req, res, next) => {
	await User.findById(req.params.id)
	.then(result => {
		if (!result)  return res.status(400).json({
			status: res.statusCode,
			message: 'Data not found !',
			data: false,
		})

		res.status(200).json({
			status: res.statusCode,
			message: 'success',
			data: result,
		})
	})
	.catch(err => {
		next(err)
	})
}

exports.userStore = async (req, res, next) => {
	const errors = validationResult(req)

	if (!req.file)  return res.status(400).json({
		status: res.statusCode,
		message: 'Image is required !',
		data: false,
	})

	if (!errors.isEmpty()) {
		removeImage(req.file.path)
		return res.status(400).json({
			status: res.statusCode,
			message: 'Invalid value !',
			data: errors.array(),
		})
	}

	const salt = await bcrypt.genSalt(10)
	const hash = await bcrypt.hash(req.body.password, salt)

	const userRequest = new User({
		name: req.body.name,
		username: req.body.username,
		email: req.body.email,
		password: hash,
		address: req.body.address,
		photo: req.file.path,
		user_id: {
			uid: 1,
			name: 'Hery Fidiawan'
		}
	})
	
	userRequest.save()
	
	.then(result => {
		res.status(200).json({
			status: res.statusCode,
			message: 'success',
			data: result,
		})
	})
	.catch(err => {
		next(err)
	})
}

exports.userUpdate = async (req, res, next) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return res.status(400).json({
		status: res.statusCode,
		message: 'Invalid value !',
		data: errors.array(),
	})

	User.findById(req.params.id)
	.then(async user => {
		if (!user)  return res.status(400).json({
			status: res.statusCode,
			message: 'Data not found !',
			data: false,
		})

		let photo = user.photo
		if (req.file) {
			if (user.photo) {
				removeImage(user.photo)
			}
			photo = req.file.path
		}

		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(req.body.password, salt)
		
		user.name = req.body.name
		user.username = req.body.username
		user.email = req.body.email
		user.password = hash
		user.address = req.body.address
		user.photo = photo
		user.user_id = {
			uid: 1,
			name: 'Hery Fidiawan'
		}

		return user.save()
	})
	.then(result => {
		res.status(201).json({
			status: res.statusCode,
			message: 'success',
			data: result,
		})
	})
	.catch(err => {
		next(err)
	})
}

exports.userDestroy = async (req, res, next) => {
	await User.findById(req.params.id)
	.then(user => {
		if (!user)  return res.status(400).json({
			status: res.statusCode,
			message: 'Data not found !',
			data: false,
		})

		if (user.photo) {
			removeImage(user.photo)
		}
		return User.findByIdAndRemove(req.params.id)
	})
	.then(result => {
		res.status(200).json({
			status: res.statusCode,
			message: 'success',
			data: result,
		})
	})
	.catch(err => {
		next(err)
	})
}

const removeImage = (filePath) => {
	filePath = path.join(__dirname, '../..', filePath)
	fs.unlink(filePath, err => console.log('Image not found !'))
}

