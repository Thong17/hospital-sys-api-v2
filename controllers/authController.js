const response = require('../helpers/response')
const { loginValidation } = require('../validations/authValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, issueToken } = require('../helpers/utils')

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