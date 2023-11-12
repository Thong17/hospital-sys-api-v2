const { memoryStorage, minioStorage } = require('../../../configs/multer')
const router = require('express').Router()
const { activity } = require('../../../middlewares/security')
const { create, _delete, list, detail, update, history, _export, _validate, _import } = require('../../../controllers/productController')


router.post('/create', minioStorage.array('images'), (...params) => activity(...params, 'PRODUCT', 'CREATE'), (req, res) => {
    create(req, res)
})

router.delete('/delete/:id', (...params) => activity(...params, 'PRODUCT', 'DELETE'), (req, res) => {
    _delete(req, res)
})

router.put('/update/:id', minioStorage.array('images'), (...params) => activity(...params, 'PRODUCT', 'UPDATE'), (req, res) => {
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

router.post('/validate', memoryStorage.single('excel'), (req, res) => {
    _validate(req, res)
})

router.post('/import', (req, res) => {
    _import(req, res)
})


module.exports = router
