const response = require('../helpers/response')
const { createHash } = require('../helpers/utils')
const { MissingFieldError, BadRequestError } = require('../helpers/handlingErrors')

exports.hash = (req, res, next) => {
    try {
        const token = req.headers.token || ''
        const hash = req.headers.hash
        const timestamp = req.headers.timestamp
        const body = req.body
        if (!hash || !timestamp) throw new MissingFieldError('Missing request header and timestamp')
        
        const str = JSON.stringify(body) + process.env.HASH_SECRET + timestamp + token
        const hashed_str = createHash(str)
        if (hashed_str !== hash) throw new BadRequestError('Hashed body is invalid!')
        next()
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error) 
    }
}

exports.auth = (req, res, next) => {
    next()
}


