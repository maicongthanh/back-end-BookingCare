import postsService from '../services/postsService'

let postNewPosts = async (req, res) => {
    try {
        let response = await postsService.postNewPosts(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllPosts = async (req, res) => {
    try {
        let response = await postsService.getAllPosts()
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let deletePosts = async (req, res) => {
    try {
        let response = await postsService.deletePosts(req.query.id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailPosts = async (req, res) => {
    try {
        let response = await postsService.getDetailPosts(req.query.id)
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
    postNewPosts,
    getAllPosts,
    deletePosts,
    getDetailPosts
}