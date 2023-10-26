const router = require('express').Router()
const { getPermission, getPrePermission, create, _delete, list, detail, update } = require('../../../controllers/roleController')

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

router.put('/update/:id', (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})

module.exports = router
