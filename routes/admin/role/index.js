const router = require('express').Router()
const { getPermission, getPrePermission, create, _delete, list } = require('../../../controllers/roleController')

router.get('/getPermission', (req, res) => {
    getPermission(req, res)
})

router.get('/getPrePermission', (req, res) => {
    getPrePermission(req, res)
})

router.post('/create', (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (req, res) => {
    _delete(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})

module.exports = router
