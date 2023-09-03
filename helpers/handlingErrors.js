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

module.exports = { MissingFieldError, BadRequestError }