const router = require('express').Router()

router.use('/role', require('./role'))
router.use('/user', require('./user'))
router.use('/doctor', require('./doctor'))

module.exports = router