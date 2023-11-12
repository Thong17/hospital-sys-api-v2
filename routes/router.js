const router = require('express').Router()
const response = require('../helpers/response')
const { minioClient } = require('../configs/multer')
const security = require('../middlewares/security')

router.get('/upload/:filename', async (req, res) => {
    try {
        const filename = req.params.filename
        const bucketName = req.query.bucket ?? process.env.MINIO_BUCKET
        const mimeType = req.query.mimeType ?? 'image/jpeg'
        const stream = await minioClient.getObject(bucketName, filename !== 'null' ? filename : 'default.png')
        res.set('Content-Type', mimeType)
        stream.pipe(res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
})

router.use(security.hash)
router.use('/auth', require('./auth'))
router.use(security.auth)
router.use('/home', require('./home'))
router.use('/admin', require('./admin'))
router.use('/organize', require('./organize'))
router.use('/operation', require('./operation'))

module.exports = router