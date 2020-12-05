const express = require('express')
const router  = express.Router()
const {body}  = require('express-validator')

const tokenVerify = require('../validator/token')
const userController = require('../controllers/user')

// INDEX
// user?page=1&perPage=10
// router.get('/', tokenVerify, userController.userIndex)
router.get('/', userController.userIndex)

// SHOW
router.get('/:id', tokenVerify, userController.userShow)

// CREATE
router.post('/', tokenVerify, [
		body('name').isLength({min:3}).withMessage('Name is required, minimum 3 character'),
		body('username').isLength({min:3}).withMessage('Username is required, minimum 3 character'),
		body('email').isLength({min:5}).withMessage('Email is required, minimum 5 character'),
		body('password').isLength({min:6}).withMessage('Password is required, minimum 6 character'),
		body('address').isLength({min:6}).withMessage('Address is required, minimum 6 character'),
	], userController.userStore)

// UPDATE
router.put('/:id', tokenVerify, [
		body('name').isLength({min:3}).withMessage('Name is required, minimum 3 character'),
		body('username').isLength({min:3}).withMessage('Username is required, minimum 3 character'),
		body('email').isLength({min:5}).withMessage('Email is required, minimum 5 character'),
		body('password').isLength({min:6}).withMessage('Password is required, minimum 6 character'),
		body('address').isLength({min:6}).withMessage('Address is required, minimum 6 character'),
	], userController.userUpdate)

// DELETE
router.delete('/:id', tokenVerify, userController.userDestroy)


module.exports = router