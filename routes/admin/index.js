const router = require('express').Router()

router.use('/role', require('./role'))
router.use('/user', require('./user'))
router.use('/doctor', require('./doctor'))
router.use('/patient', require('./patient'))

module.exports = router