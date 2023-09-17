const response = require('../helpers/response')
const { loginValidation, registerValidation } = require('../validations/authValidation')
const { ValidationError, UnauthorizedError } = require('../helpers/handlingErrors')
const { extractJoiErrors, issueToken, verifyToken } = require('../helpers/utils')

exports.login = async (req, res) => {
    try {
        const { error } = loginValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const accessToken = await issueToken({ id: 1 }, process.env.JWT_SECRET, Number(process.env.JWT_ACCESS_TOKEN_TIME))
        const refreshToken = await issueToken({ id: 1, accessToken }, process.env.JWT_SECRET, Number(process.env.JWT_REFRESH_TOKEN_TIME))
        return response.success(200, { accessToken, refreshToken }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.register = async (req, res) => {
    try {
        const { error } = registerValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        return response.success(200, { message: 'USER_HAS_REGISTERED' })
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const token = req.body.refreshToken
        if (!token) throw new UnauthorizedError('UNAUTHORIZED')
        await verifyToken(process.env.JWT_SECRET, token, 'REFRESH_TOKEN_EXPIRED')

        const accessToken = await issueToken({ id: 1 }, process.env.JWT_SECRET, Number(process.env.JWT_ACCESS_TOKEN_TIME))
        const refreshToken = await issueToken({ id: 1, accessToken }, process.env.JWT_SECRET, Number(process.env.JWT_REFRESH_TOKEN_TIME))
        return response.success(200, { accessToken, refreshToken }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}