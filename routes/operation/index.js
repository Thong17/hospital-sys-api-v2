const router = require('express').Router()

router.use('/reservation', require('./reservation'))
router.use('/transaction', require('./transaction'))
router.use('/payment', require('./payment'))
router.use('/schedule', require('./schedule'))

module.exports = router