const jwt = require('jsonwebtoken')
const { TokenExpiredError } = require('./handlingErrors')

module.exports = utils = {
    createHash: (str) => {
        const sha256 = require('js-sha256')
        return sha256.hex(str).toString()
    },
    extractJoiErrors: (error) => {
        const messages = []
        error.details?.forEach(error => {
            const obj = {
                path: error.message,
                key: error.context.label
            }
            messages.push(obj)
        });
        return messages
    },
    issueToken: (data, secret, expire) => {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign(data, secret, { expiresIn: expire })
                resolve(token)
            } catch (err) {
                reject(err)
            }
        })
    },
    verifyToken: (secret, accessToken, message) => {
        return new Promise(async (resolve, reject) => {
            try {
                const decodedAccessToken = jwt.verify(accessToken, secret)
                resolve(decodedAccessToken)
            } catch (error) {
                if (error.name !== 'TokenExpiredError') reject(error)
                reject(new TokenExpiredError(message))
            }
        })
    },
}