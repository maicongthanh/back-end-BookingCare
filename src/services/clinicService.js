import db from '../models/index'
import { Op, or } from 'sequelize';

let getAllClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters !'
                })
            }
            if (inputData === 'ALL') {
                let data = await db.Clinic.findAll()
                if (data) {
                    resolve({
                        errCode: 0,
                        data
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: []
                    })
                }
            } else if (inputData === 'TYPE1') {
                let data = await db.Clinic.findAll({
                    attributes: ['id', 'nameVi', 'nameEn', 'addressVi', 'addressEn', 'background']
                })
                if (data) {
                    resolve({
                        errCode: 0,
                        data
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: []
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getDetailClinic = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    }
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Not found clinic !'
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

let postInforClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                // !inputData.id ||
                !inputData.fileImage ||
                !inputData.fileBackground ||
                !inputData.nameVi ||
                !inputData.addressVi ||
                !inputData.descriptionHTMLVi ||
                !inputData.descriptionMarkdownVi ||
                !inputData.nameEn ||
                !inputData.addressEn ||
                !inputData.descriptionHTMLEn ||
                !inputData.descriptionMarkdownEn
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Clinic.create({
                        image: inputData.fileImage,
                        background: inputData.fileBackground,
                        nameVi: inputData.nameVi,
                        addressVi: inputData.addressVi,
                        descriptionHTMLVi: inputData.descriptionHTMLVi,
                        descriptionMarkdownVi: inputData.descriptionMarkdownVi,
                        nameEn: inputData.nameEn,
                        addressEn: inputData.addressEn,
                        descriptionHTMLEn: inputData.descriptionHTMLEn,
                        descriptionMarkdownEn: inputData.descriptionMarkdownEn,
                    })
                } else if (inputData.action === 'EDIT') {
                    let clinicMarkdown = await db.Clinic.findOne({
                        where: {
                            id: inputData.id
                        },
                        raw: false
                    })
                    if (clinicMarkdown) {
                        clinicMarkdown.id = inputData.id
                        clinicMarkdown.nameVi = inputData.nameVi
                        clinicMarkdown.addressVi = inputData.addressVi
                        clinicMarkdown.descriptionHTMLVi = inputData.descriptionHTMLVi
                        clinicMarkdown.descriptionMarkdownVi = inputData.descriptionMarkdownVi
                        clinicMarkdown.nameEn = inputData.nameEn
                        clinicMarkdown.addressEn = inputData.addressEn
                        clinicMarkdown.descriptionHTMLEn = inputData.descriptionHTMLEn
                        clinicMarkdown.descriptionMarkdownEn = inputData.descriptionMarkdownEn
                        clinicMarkdown.image = inputData.fileImage
                        clinicMarkdown.background = inputData.fileBackground

                        await clinicMarkdown.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save clinic success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let searchClinicByString = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.q) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            let data = await db.Clinic.findAll({
                limit: +inputData.limit,
                where: {
                    nameVi: {
                        [Op.like]: '%' + inputData.q + '%'
                    },
                },
                attributes: ['id', 'nameVi', 'nameEn', 'background']
            })
            if (data && data.length > 0) {
                resolve({
                    errCode: 0,
                    data
                })
            } else {
                resolve({
                    errCode: 1,
                    data: []
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    getAllClinic,
    postInforClinic,
    getDetailClinic,
    searchClinicByString
}