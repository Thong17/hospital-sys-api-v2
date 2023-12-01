const response = require('../helpers/response')
const Payment = require('../models/Payment')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Transaction = require('../models/Transaction')

exports.sale = async (req, res) => {
    try {
        const chart = req.query.chart || 'DAILY'
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        let formatChart = ''
        switch (true) {
            case chart === 'YEARLY':
                formatChart = '%Y'
                break

            case chart === 'MONTHLY':
                formatChart = '%m-%Y'
                break
        
            default:
                formatChart = '%d-%m-%Y'
                break
        }
        const query = { stage: 'COMPLETED' }
        if (startDate && endDate) {
            query['createdAt'] = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        const pipeline = [
            {
                $match: query
            },
            {
                $addFields: {
                    monthYear: {
                        $dateToString: {
                            format: formatChart,
                            date: '$createdAt',
                            timezone: 'UTC'
                        }
                    }
                }
            },
            {
                $group: {
                    _id: '$monthYear',
                    count: { $sum: 1 },
                    total: { $sum: '$total' }
                }
            },
            {
                $project: {
                    _id: 0,
                    monthYear: '$_id',
                    count: 1,
                    total: 1
                }
            },
            {
                $sort: {
                    monthYear: 1
                }
            },
            {
                $limit: 12
            }
        ]
        const payments = await Payment.aggregate(pipeline).exec()
        const totalPayments = await Payment.find({ stage: 'COMPLETED' }).select('total transactions').populate('transactions')
        let totalCost = 0
        let totalPayment = 0
        totalPayments?.forEach(payment => {
            const totalTransactionCost = payment.transactions?.reduce((acc, obj) => acc + obj.cost, 0)
            totalCost += totalTransactionCost
            totalPayment += payment.total
        })
        response.success(200, { chart: payments, totalCost, totalPayment }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.product = async (req, res) => {
    try {
        const page = parseInt(req.query.page ?? 1)
        const limit = parseInt(req.query.limit ?? 0)
        const skip = page - 1

        const totalProduct = await Product.countDocuments({ isDeleted: false })
        const totalCategory = await Category.countDocuments({ isDeleted: false })
        const products = await Product.find({ isDeleted: false })
            .skip((skip) * limit)
            .limit(limit)
            .select('name price currency isStock code description')
            .populate('currency', 'currency symbol')

        const mappedProducts = []
        for (let i = 0; i < products.length; i++) {
            let product = {
                _id: products[i]?._id,
                name: products[i]?.name,
                description: products[i]?.description,
                price: products[i]?.price,
                currency: products[i]?.currency,
            }
            const transactions = await Transaction.find({ product: product?._id, stage: 'COMPLETED' })
            product['soldQuantity'] = transactions.reduce((curr, obj) => curr + obj.quantity, 0)
            product['totalSale'] = transactions.reduce((curr, obj) => curr + obj.total, 0)
            product['totalCost'] = transactions.reduce((curr, obj) => curr + obj.cost, 0)
            mappedProducts.push(product)
        }

        response.success(200, { totalProduct, totalCategory, products: mappedProducts, metaData: { skip, limit, total: totalProduct } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message }, res, error)
    }
}