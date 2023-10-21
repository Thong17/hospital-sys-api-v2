const router = require('express').Router()
const { getPermission, getPrePermission } = require('../../../controllers/roleController')

router.get('/getPermission', (req, res) => {
    getPermission(req, res)
})

router.get('/getPrePermission', (req, res) => {
    getPrePermission(req, res)
})

module.exports = router
