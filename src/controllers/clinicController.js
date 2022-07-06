import clinicService from '../services/clinicService'

let getAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinic(req.query.type)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}


let getDetailClinic = async (req, res) => {
    try {
        let response = await clinicService.getDetailClinic(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforClinic = async (req, res) => {
    try {
        let response = await clinicService.postInforClinic(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let searchClinicByString = async (req, res) => {
    try {
        let response = await clinicService.searchClinicByString(req.query)
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
    getAllClinic,
    postInforClinic,
    getDetailClinic,
    searchClinicByString
}