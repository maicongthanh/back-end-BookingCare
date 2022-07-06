import doctorService from '../services/doctorService'

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    let type = req.query.type
    if (!limit) {
        limit = 10;
    }
    if (!type) {
        type = 'ALL'
    }
    try {
        let response = await doctorService.getTopDoctor(+limit, type)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllDoctor()
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.postInforDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let response = await doctorService.getDetailDoctor(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let detailDoctorClinicSpecialty = async (req, res) => {
    try {
        let response = await doctorService.detailDoctorClinicSpecialty(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let response = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSchedule = async (req, res) => {
    try {
        let response = await doctorService.getDetailSchedule(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleDeleteDetailSchedule = async (req, res) => {
    try {
        let response = await doctorService.handleDeleteDetailSchedule(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getProfileDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailDistrictByProvince = async (req, res) => {
    try {
        let response = await doctorService.getDetailDistrictByProvince(req.query.provinceId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailClinicDoctorById = async (req, res) => {
    try {
        let response = await doctorService.getDetailClinicDoctorById(req.query.doctorId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDoctorWithSpecialtyAndLocationById = async (req, res) => {
    try {
        let response = await doctorService.getDoctorWithSpecialtyAndLocationById(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDoctorWithClinicSpecialtyById = async (req, res) => {
    try {
        let response = await doctorService.getDoctorWithClinicSpecialtyById(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllAppointmentOfDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllAppointmentOfDoctor(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let response = await doctorService.sendRemedy(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllBillOfDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllBillOfDoctor(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllBillWithWeekMonthOfDoctor = async (req, res) => {
    try {
        let response = await doctorService.getAllBillWithWeekMonthOfDoctor(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchDoctorByString = async (req, res) => {
    try {
        let response = await doctorService.searchDoctorByString(req.query)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
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