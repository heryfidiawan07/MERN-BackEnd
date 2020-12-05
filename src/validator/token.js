const jwt = require('jsonwebtoken')

const verify = (req, res, next) => {
	const ContentType   = req.header('Content-Type')
	const Authorization = req.header('Authorization')

	if (!Authorization && !ContentType) return res.status(400).json({
		status: res.statusCode,
		message: 'Access Denied !'
	})

	try{
		const verified = jwt.verify(Authorization, process.env.SECRET_KEY)
		req.user = verified
		next()
	}catch(err) {
		res.status(400).json({
			status: res.statusCode,
			message: 'Invalid Token !'
		})
	}
}


module.exports = verify