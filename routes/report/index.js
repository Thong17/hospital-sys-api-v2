const router = require('express').Router()
const { sale } = require('../../controllers/reportController')

router.get('/sale', (req, res) => {
    sale(req, res)
})

module.exports = router