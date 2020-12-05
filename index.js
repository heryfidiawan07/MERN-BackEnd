const express = require('express')
const parser  = require('body-parser')
const multer  = require('multer')
const path    = require('path')

const app 	   = express()
const mongoose = require('mongoose')
require('dotenv/config')

const authRoutes = require('./src/routes/auth')
const userRoutes = require('./src/routes/user')

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'storage')
	},
	filename: (req, file, cb) => {
		let fileUpload = file.mimetype.split("/")
    	let extension  = fileUpload[fileUpload.length - 1]
		cb(null, new Date().getTime() + '.' + extension)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
		cb(null, true)
	}else {
		cb(null, false)
	}
}

app.use(parser.json())
// app.use(parser.urlencoded({ extended: true }))

app.use('/storage', express.static(path.join(__dirname, 'storage')))
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('photo'))

// Cors Origin
app.use((req, res, next) => {
	// req.setHeader('Access-Control-Allow-Origin', 'http:url.com')
	res.setHeader('Access-Control-Allow-Origin', '*')
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTION')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

	// console.log(req.method)
	// console.log(req.header('Content-Type'))
	// console.log("Req Body: ", req.body)
	if (req.method !== 'GET' && req.method !== 'DELETE' && !Object.keys(req.body).length) return res.status(400).json({
		status: res.statusCode,
		message: 'Empty Request',
		data: false,
	})

	next()
})

// AUTH
app.use('/auth', authRoutes)

// USER
app.use('/user', userRoutes)


// app.use((error, req, res, next) => {
// 	const status = error.errorStatus || 500
// 	const message = error.message
// 	const data = error.data

// 	// console.log("Error: ",error)
// 	// console.log("Req: ", req.body)
	
// 	res.status(status).json({
// 		message: 'Error: ' + message,
// 		data: data
// 	})
// })


mongoose.connect(process.env.DB_CONNECTION,
	{ useNewUrlParser: true, useUnifiedTopology: true })
let db = mongoose.connection

db.on('error', console.error.bind(console, 'Database error connection !'))
db.once('open', () => {
	console.log('Database is connected !')
})

// Listening
app.listen(process.env.PORT, () => {
	console.log(`Server running in ${process.env.PORT} `)
})