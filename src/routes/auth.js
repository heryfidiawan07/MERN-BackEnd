const express = require('express')
const router = express.Router()
const {body} = require('express-validator')

const authController = require('../controllers/auth')

// REGISTER
router.post('/register', [
		body('name').isLength({min:3}).withMessage('Name minimum 3 character'),
		body('email').isLength({min:5}).withMessage('Email minimum 5 character'),
		body('password').isLength({min:6}).withMessage('Password minimum 6 character')
	], authController.register)

// LOGIN
router.post('/login', [
		body('email').isLength({min:5}).withMessage('Email minimum 5 character'),
		body('password').isLength({min:6}).withMessage('Password minimum 6 character')
	], authController.login)


module.exports = router