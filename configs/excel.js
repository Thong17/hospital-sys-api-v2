const { Workbook } = require('exceljs')

const worksheetOption = {
    pageSetup: {
        firstPageNumber: 1,
        orientation: 'landscape',
        pageOrder: 'downThenOver',
        paperSize: 9,
        horizontalCentered: true,
        margins: {
          bottom: 0.5,
          footer: 0.3,
          header: 0.3,
          left: 0.45,
          right: 0.45,
          top: 0.5,
        },
    },
}

module.exports = (columnsConfig, columnHeader, rowData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const workbook = new Workbook()
            const worksheet = workbook.addWorksheet(`worksheet`.toUpperCase(), worksheetOption)

            worksheet.columns = columnsConfig
            let headerData = columnHeader

            const header = worksheet.addRow(headerData)
            header.height = 23
            header.eachCell((cell) => {
                cell.style = {
                    font: {
                        bold: true,
                        color: { argb: '000000' },
                        size: 11,
                    },
                    fill:{
                        fgColor: { argb: 'DDDDDD' } ,
                        pattern: 'solid',
                        type: 'pattern' 
                    },
                    alignment: {
                        vertical:'middle',
                        horizontal:'left'
                    }
                }
                if (['no'].includes(cell._column._key)) {
                    cell.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' }
                }
            })

            // Freeze row
            worksheet.views = [{ state: 'frozen', ySplit: 1 }]

            // Body
            for (const index in rowData) {
                if (Object.hasOwnProperty.call(rowData, index)) {
                    const data = rowData[index];
                    worksheet.addRow(data)
                }
            }

            const file = await workbook.xlsx.writeBuffer()
            resolve(file)
        } catch (error) {
            reject(error)
        }
    })
}