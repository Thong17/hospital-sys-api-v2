const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { getPermission, getPrePermission, create, _delete, list, detail, update, history, _export } = require('../../../controllers/roleController')


router.get('/getPermission', (req, res) => {
    getPermission(req, res)
})

router.get('/getPrePermission', (req, res) => {
    getPrePermission(req, res)
})

router.post('/create', (...params) => activity(...params, 'ROLE', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'ROLE', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', (...params) => activity(...params, 'ROLE', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/history/:id', (req, res) => {
    history(req, res)
})

router.get('/list', (req, res) => {
    list(req, res)
})

router.post('/export', (req, res) => {
    _export(req, res)
})

module.exports = router
