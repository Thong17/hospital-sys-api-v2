const response = require('../helpers/response')
const User = require('../models/User')
const { loginValidation, registerValidation } = require('../validations/authValidation')
const { ValidationError, UnauthorizedError } = require('../helpers/handlingErrors')
const { extractJoiErrors, issueToken, verifyToken, encryptPassword, validatePassword, comparePassword } = require('../helpers/utils')

exports.login = async (req, res) => {
    try {
        const { error } = loginValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) throw new UnauthorizedError('INCORRECT_USERNAME')

        const isMatched = await comparePassword(password, user.password)
        if (!isMatched) throw new UnauthorizedError('INCORRECT_PASSWORD')

        const accessToken = await issueToken({ id: user._id }, process.env.JWT_SECRET, Number(process.env.JWT_ACCESS_TOKEN_TIME))
        const refreshToken = await issueToken({ id: user._id, accessToken }, process.env.JWT_SECRET, Number(process.env.JWT_REFRESH_TOKEN_TIME))
       
        const data = {
            _id: user._id,
            username: user.username,
            segment: user.segment,
            privilege: user.privilege,
            navigation: user.navigation,
        }
        return response.success(200, { accessToken, refreshToken, data }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.profile = async (req, res) => {
    try {
        const data = {
            _id: req.user?._id,
            username: req.user?.username,
            segment: req.user?.segment,
            privilege: req.user?.privilege,
            navigation: req.user?.navigation,
        }
        return response.success(200, { data }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.register = async (req, res) => {
    try {
        const { error } = registerValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const data = req.body
        if (!validatePassword(data.password)) throw new ValidationError('INVALID_PASSWORD_COMPLEXITY')
        const password = await encryptPassword(data.password)
        const user = await User.create({ ...data, password })
        return response.success(200, { message: 'USER_HAS_REGISTERED', data: user }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const token = req.body.refreshToken
        if (!token) throw new UnauthorizedError('UNAUTHORIZED')
        const data = await verifyToken(process.env.JWT_SECRET, token, 'REFRESH_TOKEN_EXPIRED')

        const accessToken = await issueToken({ id: data?.id }, process.env.JWT_SECRET, Number(process.env.JWT_ACCESS_TOKEN_TIME))
        const refreshToken = await issueToken({ id: data?.id, accessToken }, process.env.JWT_SECRET, Number(process.env.JWT_REFRESH_TOKEN_TIME))
        return response.success(200, { accessToken, refreshToken }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}