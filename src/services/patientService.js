import db from '../models/index'
require('dotenv').config();
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

let checkRequiredFields = (inputData) => {
    let arrFields = [
        'doctorId', 'statusId', 'birthday',
        'timeType', 'date', 'address',
        'email', 'firstName', 'lastName',
        'phoneNumber', 'gender', 'reason'
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

let sendMail = async (inputData, token) => {

    await emailService.sendSimpleEmail({
        receiverEmail: inputData.email,
        patientName: inputData.patientName,
        doctorName: inputData.doctorName,
        time: `${inputData.labelTime} ${inputData.formattedDate}`,
        addressClinic: inputData.addressClinic,
        language: inputData.language,
        redirectLink: buildUrlEmail(inputData.doctorId, token)
    })
}

let postBookAppointment = (inputData) => {
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
                let token = uuidv4()
                let user = await db.Booking.findAll({
                    where: { email: inputData.email },
                    raw: false
                })
                if (user && user.length === 0) {
                    await db.Booking.create({
                        role: 'R3',
                        statusId: 'S1',
                        doctorId: inputData.doctorId,
                        birthday: inputData.birthday,
                        timeType: inputData.timeType,
                        date: inputData.date,
                        address: inputData.address,
                        firstName: inputData.firstName,
                        lastName: inputData.lastName,
                        phoneNumber: inputData.phoneNumber,
                        gender: inputData.gender,
                        reason: inputData.reason,
                        email: inputData.email,
                        token: token,
                        price: inputData.price
                    })
                    sendMail(inputData, token)
                    resolve({
                        errCode: 0,
                        errMessage: 'Success'
                    })
                }
                if (user && user.length > 0) {
                    let data = user.filter((item, index) => {
                        return item.statusId === 'S2'
                    })
                    if (data.length > 0) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Email đã đặt lịch'
                        })
                    } else {
                        let data = user.filter((item, index) => {
                            return item.statusId === 'S1'
                        })
                        if (data[0]) {
                            data[0].role = 'R3'
                            data[0].statusId = 'S1'
                            data[0].doctorId = inputData.doctorId
                            data[0].birthday = inputData.birthday
                            data[0].timeType = inputData.timeType
                            data[0].date = inputData.date
                            data[0].address = inputData.address
                            data[0].firstName = inputData.firstName
                            data[0].lastName = inputData.lastName
                            data[0].phoneNumber = inputData.phoneNumber
                            data[0].gender = inputData.gender
                            data[0].reason = inputData.reason
                            data[0].token = token,
                                data[0].price = inputData.price
                            await data[0].save()

                            sendMail(inputData, token)
                            resolve({
                                errCode: 0,
                                errMessage: 'Success'
                            })
                        } else {
                            let data = user.filter((item, index) => {
                                return item.statusId === 'S3'
                            })
                            if (data.length > 0) {
                                await db.Booking.create({
                                    role: 'R3',
                                    statusId: 'S1',
                                    doctorId: inputData.doctorId,
                                    birthday: inputData.birthday,
                                    timeType: inputData.timeType,
                                    date: inputData.date,
                                    address: inputData.address,
                                    firstName: inputData.firstName,
                                    lastName: inputData.lastName,
                                    phoneNumber: inputData.phoneNumber,
                                    gender: inputData.gender,
                                    reason: inputData.reason,
                                    email: inputData.email,
                                    token: token,
                                    price: inputData.price
                                })
                                sendMail(inputData, token)
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Success'
                                })
                            }
                        }
                    }

                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment success'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'The appointment has been activated or does not exist, please check again !'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment
}