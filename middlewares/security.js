const response = require('../helpers/response')
const { createHash, verifyToken } = require('../helpers/utils')
const { MissingFieldError, BadRequestError, UnauthorizedError } = require('../helpers/handlingErrors')

exports.hash = (req, res, next) => {
    try {
        const token = req.headers.authorization || ''
        const hash = req.headers.hash
        const timestamp = req.headers.timestamp
        const body = req.body
        if (!hash || !timestamp) throw new MissingFieldError('MISSING_HEADER')
        
        const str = JSON.stringify(body) + process.env.HASH_SECRET + timestamp + token.replace('Bearer ', '')
        const hashed_str = createHash(str)
        if (hashed_str !== hash) throw new BadRequestError('INVALID_HASH')
        next()
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error) 
    }
}

exports.auth = async (req, res, next) => {
    const accessToken = req.headers.authorization?.replace('Bearer ', '')
    try {
        if (!accessToken) throw new UnauthorizedError('UNAUTHORIZED')
        await verifyToken(process.env.JWT_SECRET, accessToken)
        next()
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}

exports.activity = (req, res, next, module) => {
    try {
        const log = {
            data: JSON.stringify(req.body),
            url: req.url,
            module,
            moduleId: req.params.id
        }
        res.log = log
        next()
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}
