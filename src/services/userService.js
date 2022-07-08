import db from '../models/index'
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import emailService from '../services/emailService'
import { Op } from 'sequelize';
require('dotenv').config();
var salt = bcrypt.genSaltSync(10);

let getAllUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            let users = '';
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters',
                    users: []
                })
            }
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                users: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['email', 'password'
        // , 'lastName', 'address', 'firstName'
    ]
    let isValid = true;
    let element = ''
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false
            element = arrFields[i]
            break;
        }
    }
    return {
        isValid,
        element
    }
}

let hashPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: email
                }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let handleCreateNewUser = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameters ${checkObj.element}`
                })
            } else {
                let checkEmailUser = await checkEmail(inputData.email)
                if (checkEmailUser === true) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Email is exist , please try other email '
                    })
                } else {
                    let hashPasswordUser = await hashPassword(inputData.password)
                    await db.User.create({
                        email: inputData.email,
                        password: hashPasswordUser,
                        firstName: inputData.firstName,
                        lastName: inputData.lastName,
                        address: inputData.address,
                        role: inputData.role,
                        position: inputData.position,
                        gender: inputData.gender,
                        phoneNumber: inputData.phoneNumber,
                        image: inputData.avatar,
                        fullName: `${inputData.firstName} ${inputData.lastName}`,
                        birthday: inputData.selectedBirthday
                    })
                    resolve({
                        errCode: 0,
                        Message: 'OK'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let handleDeleteUser = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            if (inputData) {
                let user = await db.User.findOne({
                    where: {
                        id: inputData
                    },
                    raw: false
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'The user is not exist'
                    })
                } else {
                    await user.destroy()
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

let handleLogin = (inputData) => {
    return new Promise(async (resolve, reject) => {
        let { email, password } = inputData
        try {
            let userData = {};
            if (!email || !password) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing parameters'
                })
            }
            let isExist = await checkEmail(email)
            if (isExist) {

                let user = await db.User.findOne({
                    where: { email: email },
                    include: [
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: [],
                            include: [
                                { model: db.Specialty, as: 'specialtyTypeData', attributes: ['nameVi', 'nameEn'] },
                                { model: db.Clinic, as: 'clinicTypeData', attributes: ['nameVi', 'nameEn'] }
                            ]
                        },

                    ],
                    raw: true,
                    nest: true
                });

                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password
                        userData.user = user;
                    } else {
                        userData.errCode = 4;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 3
                    userData.errMessage = 'User is not found'
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in your system. Plz try other email `
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let handleChangePassword = (inputData) => {
    return new Promise(async (resolve, reject) => {
        let { email, passwordCurrent, passwordChange, option } = inputData
        try {
            if (option === 'TYPE1') {
                if (!email || !passwordCurrent || !passwordChange) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Missing parameters'
                    })
                }
                let isExist = await checkEmail(email)
                if (isExist) {

                    let user = await db.User.findOne({
                        where: { email: email },
                        raw: false
                    });

                    if (user) {
                        let check = await bcrypt.compareSync(passwordCurrent, user.password);
                        if (check) {
                            let hashPasswordUser = await hashPassword(passwordChange)
                            user.password = hashPasswordUser
                            await user.save()
                            resolve({
                                errCode: 0,
                                errMessage: 'Change Success'
                            })

                        } else {
                            resolve({
                                errCode: 4,
                                errMessage: 'Mật khẩu không chính xác'
                            })
                        }
                    } else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found'
                        })
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Not found'
                    })
                }
            } else if (option === 'TYPE2') {
                if (!email || !passwordChange) {
                    resolve({
                        errCode: 1,
                        errMessage: 'Missing parameters'
                    })
                }
                let isExist = await checkEmail(email)
                if (isExist) {
                    let user = await db.User.findOne({
                        where: { email: email },
                        raw: false
                    });
                    let data = await db.ForgotPassword.findOne({
                        where: {
                            email: email,
                            statusId: 'S1'
                        },
                        raw: false
                    })
                    if (data) {
                        console.log('-------------------------------------------0');
                        console.log(data);

                        console.log('-------------------------------------------1');

                        data.statusId = 'S2'
                        await data.save()
                    }
                    if (user) {
                        let hashPasswordUser = await hashPassword(passwordChange)
                        user.password = hashPasswordUser
                        await user.save()
                        resolve({
                            errCode: 0,
                            errMessage: 'Change Success'
                        })
                    }
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

let handleForgotPassword = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email
                || !inputData.statusId || !inputData.language
            ) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing parameters'
                })
            }
            let isExist = await checkEmail(inputData.email)
            if (isExist) {
                let token = uuidv4()
                let user = await db.ForgotPassword.findOne({
                    where: {
                        email: inputData.email,
                        statusId: inputData.statusId,

                    },
                    raw: false
                });

                if (user) {
                    user.token = token
                    user.timeDate = inputData.timeDate
                    await user.save()
                    sendEmailForgot(inputData, token)
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    await db.ForgotPassword.create({
                        email: inputData.email,
                        token: token,
                        statusId: 'S1',
                        timeDate: inputData.timeDate
                    })
                    sendEmailForgot(inputData, token)
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Email không tồn tại'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let sendEmailForgot = async (inputData, token) => {
    await emailService.sendEmailForgotPassword({
        receiverEmail: inputData.email,
        language: inputData.language,
        redirectLink: buildUrlEmail(inputData.email, token)
    })
}

let buildUrlEmail = (email, token) => {
    let result = `${process.env.URL_REACT}/verify-forgot-password?token=${token}&email=${email}`
    return result;
}


let verifyForgotPassword = (data) => {
    console.log(data.newTimeDate);
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.token || !data.newTimeDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let user = await db.ForgotPassword.findOne({
                    where: {
                        email: data.email,
                        token: data.token,
                    },
                    raw: false
                })
                if (user) {
                    if (+user.timeDate + 900000 > data.newTimeDate) {
                        if (user.statusId === 'S1') {
                            resolve({
                                errCode: 0,
                                errMessage: 'Success'
                            })
                        } else if (user.statusId === 'S2') {
                            resolve({
                                errCode: 2,
                                errMessage: 'Password is onchange success'
                            })
                        }
                    } else {
                        user.statusId = 'S2'
                        await user.save()
                        resolve({
                            errCode: 3,
                            errMessage: 'Email has expired'
                        })
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'The user is not exist'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


let handleEditUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.role || !data.position || !data.gender) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            }
            if (data) {
                let user = await db.User.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'The user is not exist'
                    })
                } else {
                    user.id = data.id
                    user.firstName = data.firstName
                    user.lastName = data.lastName
                    user.address = data.address
                    user.role = data.role
                    user.gender = data.gender
                    user.position = data.position
                    user.phoneNumber = data.phoneNumber
                    user.image = data.avatar
                    user.fullName = `${data.firstName} ${data.lastName}`
                    user.birthday = data.selectedBirthday
                    await user.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update Success'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllCode = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let searchUserByString = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.q) {
                let data = await db.User.findAll({
                    attributes: {
                        exclude: ['image']
                    }
                })
                resolve({
                    errCode: 0,
                    data
                })
            } else {
                let data = await db.User.findAll({
                    limit: +inputData.limit,
                    where: {
                        email: {
                            [Op.like]: '%' + inputData.q + '%'
                        },
                    },
                    attributes: {
                        exclude: ['image']
                    }
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
            }

        } catch (e) {
            reject(e)
        }
    })
}

let searchAllByString = (inputData) => {
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
            let data1 = await db.Specialty.findAll({
                limit: +inputData.limit,
                where: {
                    nameVi: {
                        [Op.like]: '%' + inputData.q + '%'
                    },
                },
                attributes: ['id', 'nameVi', 'nameEn', 'image']
            })
            let data2 = await db.User.findAll({
                limit: +inputData.limit,
                where: {
                    fullName: {
                        [Op.like]: '%' + inputData.q + '%'
                    },
                    role: inputData.role
                },
                attributes: ['id', 'lastName', 'firstName', 'image']
            })
            if (data.length > 0 || data1.length > 0 || data2.length > 0) {
                resolve({
                    errCode: 0,
                    data,
                    data1,
                    data2
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Not found'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllUser,
    handleCreateNewUser,
    handleLogin,
    handleDeleteUser,
    handleEditUser,
    getAllCode,
    handleChangePassword,
    handleForgotPassword,
    verifyForgotPassword,
    searchUserByString,
    searchAllByString
}