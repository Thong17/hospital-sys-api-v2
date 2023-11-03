const History = require('../models/History')

const successCode = {
    200: 'SUCCESS',
    201: 'CREATED',
    202: 'ACCEPTED',
    203: 'NON_AUTHORIZE'
}

const failureCode = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZE',
    402: 'PAYMENT_REQUIRED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    405: 'METHOD_NOT_ALLOWED',
    406: 'NOT_ACCEPTABLE',
    408: 'REQUEST_TIMEOUT',
    411: 'HEADER_REQUIRED',
    422: 'UNPROCESSABLE_ENTITY',
    500: 'INTERNAL_SERVER_ERROR'
}

exports.success = (code = 200, data, res) => {
    try {
        if (res.log) {
            if (!res.log.moduleId) res.log.moduleId = data?.data?._id
            History.create(res.log)
        }
        
        const result = {
            code: successCode[code] || 'UNKNOWN_CODE',
            ...data
        }
        res.status(code)
        res.json(result)
    } catch (error) {
        res.status(200)
        res.json(error)
    }
}

exports.failure = (code = 500, data, res, error) => {
    try {
        const result = {
            code: failureCode[code] || 'UNKNOWN_CODE',
            ...data
        }
        error && console.error(error)
        res.status(code)
        res.json(result)
    } catch (error) {
        // TODO: Handle Invalid status code 11000 when duplicate
        res.status(500)
        res.json(error)
    }
}

