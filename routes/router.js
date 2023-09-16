const router = require('express').Router()
const security = require('../middlewares/security')

router.use(security.hash)
router.use('/auth', require('./auth'))
router.use(security.auth)
router.use('/home', require('./home'))

module.exports = router