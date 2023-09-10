const response = require('../helpers/response')
const { loginValidation } = require('../validations/authValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors } = require('../helpers/utils')

exports.login = (req, res) => {
    try {
        const { error } = loginValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        return response.success(200, {}, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message, fields: error.fields }, res, error) 
    }
}