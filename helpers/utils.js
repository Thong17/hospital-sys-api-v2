const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('./handlingErrors')

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
    verifyToken: (secret, accessToken, refreshToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                const decodedAccessToken = jwt.verify(accessToken, secret)
                resolve(decodedAccessToken)
            } catch (error) {
                if (error.name !== 'TokenExpiredError') reject(error)
                if (!refreshToken) reject(new UnauthorizedError('UNAUTHORIZED'))
                try {
                    const decodedRefreshToken = jwt.verify(refreshToken, secret)
                    if (decodedRefreshToken.accessToken !== accessToken) reject(new UnauthorizedError('UNAUTHORIZED'))
                    delete decodedRefreshToken.accessToken
                    const newAccessToken = await utils.issueToken({ id: decodedRefreshToken.id }, process.env.JWT_SECRET, Number(process.env.JWT_ACCESS_TOKEN_TIME))
                    const newRefreshToken = await utils.issueToken({ id: decodedRefreshToken.id, accessToken: newAccessToken }, process.env.JWT_SECRET, Number(process.env.JWT_REFRESH_TOKEN_TIME))
                    resolve({ ...decodedRefreshToken, newAccessToken, newRefreshToken })
                } catch (error) {
                    reject(error)
                }
                
            }
        })
    },
}