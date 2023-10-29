const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const xlsx = require('xlsx')
const bcrypt = require('bcrypt')
const { TokenExpiredError } = require('./handlingErrors')

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

            return obj
        })
    }
}