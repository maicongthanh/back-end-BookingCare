import specialtyService from '../services/specialtyService'

let getAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty(req.query.type)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getDetailSpecialty(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postInforSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.postInforSpecialty(req.body)
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
    getAllSpecialty,
    postInforSpecialty,
    getDetailSpecialty
}