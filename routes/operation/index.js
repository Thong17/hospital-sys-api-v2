const router = require('express').Router()

router.use('/reservation', require('./reservation'))

module.exports = router