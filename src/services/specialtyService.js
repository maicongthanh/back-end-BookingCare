import db from '../models/index'

let getAllSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            if (inputData === 'ALL') {
                let data = await db.Specialty.findAll()
                if (!data) {
                    resolve({
                        errCode: 0,
                        data: []
                    })
                }
                if (data) {
                    resolve({
                        errCode: 0,
                        data
                    })
                }
            } else if (inputData === 'TYPE1') {
                let data = await db.Specialty.findAll({
                    attributes: ['id', 'nameVi', 'nameEn', 'image']
                })
                if (!data) {
                    resolve({
                        errCode: 0,
                        data: []
                    })
                }
                if (data) {
                    resolve({
                        errCode: 0,
                        data
                    })
                }
            } else if (inputData === 'TYPE2') {
                let data = await db.Specialty.findAll({
                    attributes: ['id', 'nameVi', 'nameEn']
                })
                if (!data) {
                    resolve({
                        errCode: 0,
                        data: []
                    })
                }
                if (data) {
                    resolve({
                        errCode: 0,
                        data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSpecialty = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    }
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Not found Specialty !'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let postInforSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                // !inputData.id ||
                !inputData.fileImage ||
                !inputData.nameVi ||
                !inputData.descriptionHTMLVi ||
                !inputData.descriptionMarkdownVi ||
                !inputData.nameEn ||
                !inputData.descriptionHTMLEn ||
                !inputData.descriptionMarkdownEn
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Specialty.create({
                        nameVi: inputData.nameVi,
                        descriptionHTMLVi: inputData.descriptionHTMLVi,
                        descriptionMarkdownVi: inputData.descriptionMarkdownVi,
                        nameEn: inputData.nameEn,
                        descriptionHTMLEn: inputData.descriptionHTMLEn,
                        descriptionMarkdownEn: inputData.descriptionMarkdownEn,
                        image: inputData.fileImage
                    })
                } else if (inputData.action === 'EDIT') {
                    let specialtyMarkdown = await db.Specialty.findOne({
                        where: { id: inputData.id },
                        raw: false
                    })
                    if (specialtyMarkdown) {
                        specialtyMarkdown.id = inputData.id
                        specialtyMarkdown.nameVi = inputData.nameVi
                        specialtyMarkdown.descriptionHTMLVi = inputData.descriptionHTMLVi
                        specialtyMarkdown.descriptionMarkdownVi = inputData.descriptionMarkdownVi

                        specialtyMarkdown.nameEn = inputData.nameEn
                        specialtyMarkdown.descriptionHTMLEn = inputData.descriptionHTMLEn
                        specialtyMarkdown.descriptionMarkdownEn = inputData.descriptionMarkdownEn
                        specialtyMarkdown.image = inputData.fileImage
                        await specialtyMarkdown.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save clinic specialty'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllSpecialty,
    postInforSpecialty,
    getDetailSpecialty
}