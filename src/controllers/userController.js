import userService from '../services/userService'

let getAllUser = async (req, res) => {
    try {
        let infor = await userService.getAllUser(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleCreateNewUser = async (req, res) => {
    try {
        let infor = await userService.handleCreateNewUser(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleLogin = async (req, res) => {
    try {
        let infor = await userService.handleLogin(req.body)
        return res.status(200).json({
            errCode: infor.errCode,
            message: infor.errMessage,
            user: infor.user ? infor.user : {}
        })
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleChangePassword = async (req, res) => {
    try {
        let response = await userService.handleChangePassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleForgotPassword = async (req, res) => {
    try {
        let response = await userService.handleForgotPassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let verifyForgotPassword = async (req, res) => {
    try {
        let response = await userService.verifyForgotPassword(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


let handleDeleteUser = async (req, res) => {
    try {
        let infor = await userService.handleDeleteUser(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleEditUser = async (req, res) => {
    try {
        let infor = await userService.handleEditUser(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllCode = async (req, res) => {
    try {
        let infor = await userService.getAllCode(req.query.type)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchUserByString = async (req, res) => {
    try {
        let infor = await userService.searchUserByString(req.query)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchAllByString = async (req, res) => {
    try {
        let infor = await userService.searchAllByString(req.query)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
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