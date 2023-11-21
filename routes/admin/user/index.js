const { memoryStorage } = require('../../../configs/multer')
const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list, detail, info, update, history, _export, _validate, _import } = require('../../../controllers/userController')


router.post('/create', (...params) => activity(...params, 'USER', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'USER', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', (...params) => activity(...params, 'USER', 'UPDATE'), (req, res) => {
    update(req, res)
})

router.get('/detail/:id', (req, res) => {
    detail(req, res)
})

router.get('/info/:id', (req, res) => {
    info(req, res)
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

router.post('/validate', memoryStorage.single('excel'), (req, res) => {
    _validate(req, res)
})

router.post('/import', (req, res) => {
    _import(req, res)
})


module.exports = router
