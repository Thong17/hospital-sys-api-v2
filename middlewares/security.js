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
    const refreshToken = req.headers['refresh-token']
    try {
        if (!accessToken) throw new UnauthorizedError('UNAUTHORIZED')
        const data = await verifyToken(process.env.JWT_SECRET, accessToken, refreshToken)
        if (data.newAccessToken && data.newRefreshToken) {
            res.set('Access-Control-Expose-Headers', 'access-token, refresh-token')
            res.set('new-access-token', data.newAccessToken)
            res.set('new-refresh-token', data.newRefreshToken)
        }
        next()
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}


