const router = require('express').Router()
const { getPermission, getPrePermission, create } = require('../../../controllers/roleController')

router.get('/getPermission', (req, res) => {
    getPermission(req, res)
})

router.get('/getPrePermission', (req, res) => {
    getPrePermission(req, res)
})

router.post('/create', (req, res) => {
    create(req, res)
})

module.exports = router
