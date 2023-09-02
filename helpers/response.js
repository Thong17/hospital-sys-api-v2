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
    422: 'UNPROCESSABLE_ENTITY'
}

exports.success = (code, data, res) => {
    const result = {
        code: successCode[code] ? successCode[code] : 'UNKNOWN_CODE',
        ...data
    }
    res.status(code)
    res.json(result)
}

exports.failure = (code, data, res, error) => {
    const result = {
        code: failureCode[code] ? failureCode[code] : 'UNKNOWN_CODE',
        ...data
    }
    error && console.error(error)
    res.status(code || 500)
    res.json(result)
}

