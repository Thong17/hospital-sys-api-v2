class MissingFieldError extends Error {
    constructor(message) {
        super(message)
        this.code = 411
    }
}

class BadRequestError extends Error {
    constructor(message) {
        super(message)
        this.code = 400
    }
}

class ValidationError extends Error {
    constructor(message, fields) {
        super(message)
        this.code = 422
        this.fields = fields
    }
}

module.exports = { MissingFieldError, BadRequestError, ValidationError }