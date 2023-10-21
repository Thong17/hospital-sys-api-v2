const response = require('../helpers/response')

exports.getPermission = (_, res) => {
    const { privilege, navigation } = require('../constants/privilege')
    response.success(200, { privilege, navigation }, res)
}

exports.getPrePermission = (_, res) => {
    const { preMenu, preRole } = require('../constants/privilege')
    response.success(200, { preMenu, preRole }, res)
}