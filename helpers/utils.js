const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const xlsx = require('xlsx')
const bcrypt = require('bcrypt')
const { TokenExpiredError, ValidationError } = require('./handlingErrors')

module.exports = utils = {
    createHash: (str) => {
        const sha256 = require('js-sha256')
        return sha256.hex(str).toString()
    },
    extractJoiErrors: (error) => {
        const messages = []
        error.details?.forEach(error => {
            const obj = {
                path: error.message,
                key: error.context.label
            }
            messages.push(obj)
        });
        return messages
    },
    issueToken: (data, secret, expire) => {
        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign(data, secret, { expiresIn: expire })
                resolve(token)
            } catch (err) {
                reject(err)
            }
        })
    },
    verifyToken: (secret, accessToken, message) => {
        return new Promise(async (resolve, reject) => {
            try {
                const decodedAccessToken = jwt.verify(accessToken, secret)
                resolve(decodedAccessToken)
            } catch (error) {
                if (error.name !== 'TokenExpiredError') reject(error)
                reject(new TokenExpiredError(message))
            }
        })
    },
    encryptPassword: (plainPassword) => {
        return bcrypt.hash(plainPassword, 10)
    },
    comparePassword: (plainPassword, encryptedPassword) => {
        return bcrypt.compare(plainPassword, encryptedPassword)
    },
    validatePassword: (password) => {
        let passwordComplexity = new RegExp('(?=.*[a-z])(?=.*[0-9])(?=.{7,})')
        return passwordComplexity.test(password)
    },
    readExcel: (buffer) => {
        return new Promise((resolve, reject) => {
            try {
                const workbook = xlsx.read(buffer, { type: 'buffer' })
                const json = xlsx.utils.sheet_to_json(workbook.Sheets?.['WORKSHEET'] || {})
                resolve(json)
            } catch (error) {
                reject(error)
            }
        })
    },
    isHexString: (value) => {
        const hexRegex = /^[0-9a-fA-F]+$/
        return hexRegex.test(value) && value.length > 20
    },
    snakeToCamel: (value) => {
        return value.replace(/_([a-z])/g, function (_match, group) {
            return group.toUpperCase();
        }).replace(/^_/, '')
    },
    convertArrayMongo: (list) => {
        if (!Array.isArray(list)) return []
        return list?.map(data => {
            let obj = {}
            Object.keys(data)?.forEach(key => {
                const lowerCaseKey = utils.snakeToCamel(key.toLowerCase())
                let item = data[key]
                if (item === 'N/A') item = ''
                if (mongoose.Types.ObjectId.isValid(item) && utils.isHexString(item)) return obj[lowerCaseKey] = mongoose.Types.ObjectId.createFromHexString(item)
                const [main, sub] = key.split('.')
                if (main && sub) return obj[main.toLowerCase()] = { ...obj[main.toLowerCase()], [sub.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())]: item }
                try {
                    const parsedJSON = JSON.parse(item)
                    obj[lowerCaseKey] = parsedJSON
                } catch (error) {
                    obj[lowerCaseKey] = item
                }
            })
            if (!obj.id) obj.id = new mongoose.Types.ObjectId()
            delete obj.createdBy
            return obj
        })
    },
    convertStringToArrayRegExp: (value) => {
        if (typeof value !== 'string') return []
        return value?.split(' ').filter(Boolean).map(value => new RegExp(value))
    },
    createTransactionStock: async (product, quantity) => {
        const ProductStock = require('../models/ProductStock')
        return new Promise( async (resolve, reject) => {
            try {
                let transactionQuantity = quantity
                const transactionStocks = []
                const stocks = await ProductStock.find({ product }).sort({ createdAt: 'asc' })
                for (let i = 0; i < stocks.length; i++) {
                    const stock = stocks[i]
                    if (stock.remain <= 0) break
                    if (stock.remain < transactionQuantity) {
                        transactionStocks.push({ stockId: stock._id, quantity: stock.remain })
                        transactionQuantity-=stock.remain
                        stock.remain = 0
                        await stock.save()
                        break
                    }
                    transactionStocks.push({ stockId: stock._id, quantity: transactionQuantity })
                    stock.remain -= transactionQuantity
                    transactionQuantity = 0
                    await stock.save()
                    return resolve(transactionStocks)
                }
                if (transactionQuantity > 0) throw new ValidationError('PRODUCT_OUT_OF_STOCK', {})
            } catch (error) {
                reject(error)
            }
        })
    },
    reverseTransactionStock: (transactionId) => {
        const ProductStock = require('../models/ProductStock')
        const Transaction = require('../models/Transaction')
        return new Promise(async (resolve, reject) => {
            try {
                const transaction = await Transaction.findById(transactionId)
                if (!transaction) reject(new Error('TRANSACTION_NOT_FOUND'))
                for (let index = 0; index < transaction.stocks?.length; index++) {
                    const transactionStock = transaction.stocks[index]
                    const stock = await ProductStock.findById(transactionStock.stockId)
                    await ProductStock.findByIdAndUpdate(transactionStock.stockId, { remain: stock.remain + transactionStock.quantity }, { new: true })
                }
                resolve(transaction)
            } catch (error) {
                reject(error)
            }
        })
    }
}