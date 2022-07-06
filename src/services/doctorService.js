import db, { sequelize, Sequelize } from '../models/index'
require('dotenv').config();
import _, { concat } from 'lodash'
import emailService from '../services/emailService'
import { Op } from 'sequelize';


const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctor = (limitInput, typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (typeInput === 'ALL') {
                let users = await db.User.findAll({
                    limit: limitInput,
                    where: { role: 'R2' },
                    order: [['createdAt', 'DESC']],
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,

                            attributes: [],
                            include: [
                                { model: db.Specialty, as: 'specialtyTypeData', attributes: ['nameVi', 'nameEn'] }
                            ]
                        },

                    ],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: users
                })
            }
            if (typeInput === 'TYPE1') {
                let users = await db.User.findAll({
                    limit: limitInput,
                    where: { role: 'R2' },
                    order: [['createdAt', 'DESC']],
                    attributes: ['id']
                })
                resolve({
                    errCode: 0,
                    data: users
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { role: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = [
        'doctorId', 'contentHTMLVi', 'contentMarkdownVi',
        'descriptionVi', 'contentHTMLEn', 'contentMarkdownEn', 'descriptionEn',
        'priceId', 'paymentId', 'provinceId',
        'specialtyId', 'clinicId', 'noteVi', 'noteEn'
    ]
    let isValid = true;
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            break;
        }
    }
    return isValid
}

let postInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let isValid = checkRequiredFields(inputData)
            if (!isValid) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTMLVi: inputData.contentHTMLVi,
                        contentMarkdownVi: inputData.contentMarkdownVi,
                        descriptionVi: inputData.descriptionVi,
                        contentHTMLEn: inputData.contentHTMLEn,
                        contentMarkdownEn: inputData.contentMarkdownEn,
                        descriptionEn: inputData.descriptionEn,
                    })
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                        priceId: inputData.priceId,
                        provinceId: inputData.provinceId,
                        paymentId: inputData.paymentId,
                        noteVi: inputData.noteVi,
                        noteEn: inputData.noteEn,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTMLVi = inputData.contentHTMLVi
                        doctorMarkdown.contentMarkdownVi = inputData.contentMarkdownVi
                        doctorMarkdown.descriptionVi = inputData.descriptionVi
                        doctorMarkdown.contentHTMLEn = inputData.contentHTMLEn
                        doctorMarkdown.contentMarkdownEn = inputData.contentMarkdownEn
                        doctorMarkdown.descriptionEn = inputData.descriptionEn
                        await doctorMarkdown.save()
                    }
                    let doctorInfor = await db.Doctor_Infor.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorInfor) {
                        doctorInfor.specialtyId = inputData.specialtyId
                        doctorInfor.clinicId = inputData.clinicId
                        doctorInfor.priceId = inputData.priceId
                        doctorInfor.provinceId = inputData.provinceId
                        doctorInfor.paymentId = inputData.paymentId
                        doctorInfor.noteVi = inputData.noteVi
                        doctorInfor.noteEn = inputData.noteEn

                        await doctorInfor.save()
                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save infor doctor success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let doctor = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['contentHTMLVi', 'contentMarkdownVi', 'descriptionVi', 'contentHTMLEn', 'contentMarkdownEn', 'descriptionEn']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (doctor && doctor.image) {
                    doctor.image = Buffer.from(doctor.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: doctor
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let detailDoctorClinicSpecialty = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let doctor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Clinic, as: 'clinicTypeData',
                            attributes: ['nameVi', 'nameEn', 'addressVi', 'addressEn']
                        },
                        {
                            model: db.Specialty, as: 'specialtyTypeData',
                            attributes: ['nameVi', 'nameEn']
                        },
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctor) {
                    resolve({
                        errCode: 0,
                        data: {}
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: doctor
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });

                if (existing && existing.length > 0) {
                    existing = existing.map(item => {
                        item.date = +item.date
                        return item
                    })
                }

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let time = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber', 'id', 'valueTime'],
                    raw: true,
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },

                    ],
                    raw: false,
                    nest: true
                });
                if (time) {
                    resolve({
                        errCode: 0,
                        data: time
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteDetailSchedule = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            if (inputData) {
                let data = await db.Schedule.findOne({
                    where: {
                        id: inputData
                    },
                    raw: false
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'The data is not exist'
                    })
                } else {
                    await data.destroy()
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Delete success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let doctor = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['descriptionVi', 'descriptionEn']
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,

                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueVi', 'valueEn'] },
                                { model: db.Clinic, as: 'clinicTypeData', attributes: ['nameVi', 'nameEn', 'addressVi', 'addressEn'] },
                                { model: db.Specialty, as: 'specialtyTypeData', attributes: ['nameVi', 'nameEn'] }
                            ]
                        }

                    ],
                    raw: false,
                    nest: true
                })
                if (!doctor) doctor = {}
                if (doctor && doctor.image) {
                    doctor.image = Buffer.from(doctor.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data: doctor
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDetailDistrictByProvince = (provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!provinceId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let district = await db.District.findAll({
                    where: {
                        provinceId: provinceId
                    },
                    // include: [
                    //     { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                    // ],
                    // raw: false,
                    // nest: true
                })
                if (!district) district = {}

                resolve({
                    errCode: 0,
                    data: district
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getDetailClinicDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let doctorClinic = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    attributes: [],
                    include: [
                        {
                            model: db.Clinic,
                            as: 'clinicTypeData',
                            attributes: ['nameVi', 'nameEn', 'addressVi', 'addressEn']
                        },

                    ],
                    raw: false,
                    nest: true

                })
                if (!doctorClinic) doctorClinic = {}

                resolve({
                    errCode: 0,
                    data: doctorClinic
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorWithSpecialtyAndLocationById = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.specialtyId || !inputData.provinceId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                if (inputData.specialtyId && inputData.provinceId === 'ALL') {
                    let data = await db.Doctor_Infor.findAll({
                        where: {
                            specialtyId: inputData.specialtyId
                        },
                        attributes: ['doctorId'],
                    })
                    if (!data) data = {}

                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
                if (inputData.specialtyId && inputData.province !== 'ALL') {
                    let data = await db.Doctor_Infor.findAll({
                        where: {
                            specialtyId: inputData.specialtyId,
                            provinceId: inputData.provinceId
                        },
                        attributes: ['doctorId'],
                    })
                    if (!data) data = {}
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorWithClinicSpecialtyById = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.clinicId || !inputData.specialtyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                if (inputData.clinicId && inputData.specialtyId === 'ALL') {
                    let data = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputData.clinicId
                        },
                        attributes: ['doctorId'],
                    })
                    if (!data) data = {}

                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
                if (inputData.clinicId && inputData.specialtyId !== 'ALL') {
                    let data = await db.Doctor_Infor.findAll({
                        where: {
                            clinicId: inputData.clinicId,
                            specialtyId: inputData.specialtyId
                        },
                        attributes: ['doctorId'],
                    })
                    if (!data) data = {}
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllAppointmentOfDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.date || !inputData.statusId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: inputData.doctorId,
                        date: inputData.date,
                        statusId: inputData.statusId,
                    },
                    order: [
                        ['timeType', 'DESC']
                    ],
                    attributes: {
                        exclude: ['token', 'role', 'statusId', 'createdAt', 'updatedAt']
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn']
                        },
                        {
                            model: db.Allcode,
                            as: 'genderDataPatient',
                            attributes: ['valueVi', 'valueEn']
                        },
                        {
                            model: db.User,
                            as: 'doctorTypeData',
                            attributes: ['firstName', 'LastName']
                        },

                    ],
                    raw: false,
                    nest: true
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
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


let sendRemedy = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email ||
                !inputData.doctorId ||
                !inputData.patientId ||
                !inputData.timeType ||
                !inputData.imageBase64 ||
                !inputData.date
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                //update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        id: inputData.patientId,
                        timeType: inputData.timeType,
                        statusId: 'S2',
                        date: inputData.date
                    },
                    raw: false,
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                //send email remedy
                await emailService.sendAttachment(inputData)
                resolve({
                    errCode: 0,
                    errMessage: 'Success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllBillOfDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId ||
                !inputData.date ||
                !inputData.statusId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: inputData.doctorId,
                        date: inputData.date,
                        statusId: inputData.statusId
                    },
                    attributes: {
                        exclude: ['reason', 'email', 'timeType', 'token', 'id', 'doctorId', 'statusId', 'role']
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'genderDataPatient',
                            attributes: ['valueVi', 'valueEn']
                        },
                    ],
                    raw: false,
                    nest: true

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

let getAllBillWithWeekMonthOfDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId ||
                !inputData.dateDay ||
                !inputData.statusId ||
                !inputData.dateOfWeekMonth) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: inputData.doctorId,
                        statusId: inputData.statusId,
                        date: {
                            [Op.between]: [inputData.dateDay, inputData.dateOfWeekMonth]
                        }
                    },
                    attributes: {
                        exclude: ['reason', 'email', 'timeType', 'token', 'id', 'doctorId', 'statusId', 'role']
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'genderDataPatient',
                            attributes: ['valueVi', 'valueEn']
                        },
                    ],
                    raw: false,
                    nest: true

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

let searchDoctorByString = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.q) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            let data = await db.User.findAll({
                limit: +inputData.limit,
                where: {
                    fullName: {
                        [Op.like]: '%' + inputData.q + '%'
                    },
                    role: inputData.role
                },
                attributes: ['id', 'firstName', 'lastName']
            })
            if (data && data.length > 0) {
                resolve({
                    errCode: 0,
                    data
                })
            } else {
                resolve({
                    errCode: 1,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {
    getTopDoctor,
    getAllDoctor,
    postInforDoctor,
    getDetailDoctor,
    bulkCreateSchedule,
    getDetailSchedule,
    handleDeleteDetailSchedule,
    detailDoctorClinicSpecialty,
    getProfileDoctorById,
    getDetailDistrictByProvince,
    getDetailClinicDoctorById,
    getDoctorWithSpecialtyAndLocationById,
    getDoctorWithClinicSpecialtyById,
    getAllAppointmentOfDoctor,
    sendRemedy,
    getAllBillOfDoctor,
    getAllBillWithWeekMonthOfDoctor,
    searchDoctorByString
}