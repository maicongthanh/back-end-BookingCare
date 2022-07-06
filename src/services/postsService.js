import db from '../models/index'

let getAllPosts = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Posts.findAll()
            if (data) {
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

let postNewPosts = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                // !inputData.id ||
                !inputData.titleVi ||
                !inputData.titleEn ||
                !inputData.contentHTMLVi ||
                !inputData.contentMarkdownVi ||
                !inputData.contentHTMLEn ||
                !inputData.contentMarkdownEn ||
                !inputData.image
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Posts.create({
                        titleVi: inputData.titleVi,
                        titleEn: inputData.titleEn,
                        contentHTMLVi: inputData.contentHTMLVi,
                        contentMarkdownVi: inputData.contentMarkdownVi,
                        contentHTMLEn: inputData.contentHTMLEn,
                        contentMarkdownEn: inputData.contentMarkdownEn,
                        image: inputData.image
                    })
                } else if (inputData.action === 'EDIT') {
                    let postsMarkdown = await db.Posts.findOne({
                        where: { id: inputData.id },
                        raw: false
                    })
                    if (postsMarkdown) {
                        postsMarkdown.id = inputData.id
                        postsMarkdown.titleVi = inputData.titleVi
                        postsMarkdown.titleEn = inputData.titleEn

                        postsMarkdown.contentHTMLVi = inputData.contentHTMLVi
                        postsMarkdown.contentMarkdownVi = inputData.contentMarkdownVi
                        postsMarkdown.contentHTMLEn = inputData.contentHTMLEn
                        postsMarkdown.contentMarkdownEn = inputData.contentMarkdownEn
                        postsMarkdown.image = inputData.image
                        await postsMarkdown.save()
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save posts success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let deletePosts = (inputData) => {
    console.log(inputData);
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !inputData
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Posts.findOne({
                    where: {
                        id: inputData
                    },
                    raw: false,
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

let getDetailPosts = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters'
                })
            } else {
                let data = await db.Posts.findOne({
                    where: {
                        id: inputId
                    }
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Not found posts !'
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


module.exports = {
    postNewPosts,
    getAllPosts,
    deletePosts,
    getDetailPosts
}