const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { getPermission, getPrePermission, create, _delete, list, detail, update, history } = require('../../../controllers/roleController')

const setActivity = (...params) => activity(...params, 'ROLE');

router.get('/getPermission', (req, res) => {
    getPermission(req, res)
})

router.get('/getPrePermission', (req, res) => {
    getPrePermission(req, res)
})

router.post('/create', setActivity, (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', setActivity, (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', setActivity, (req, res) => {
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

module.exports = router
