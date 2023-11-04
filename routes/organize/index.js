const router = require('express').Router()

router.use('/specialty', require('./specialty'))

module.exports = router