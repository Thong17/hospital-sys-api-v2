const router = require('express').Router()

router.use('/specialty', require('./specialty'))
router.use('/symptom', require('./symptom'))
router.use('/category', require('./category'))
router.use('/exchange-rate', require('./exchangeRate'))

module.exports = router