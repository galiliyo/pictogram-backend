const express = require('express')
const  requireAuth = require('../../middlewares/requireAuth.middleware')
const { getPosts, getPost, deletePost, addPost, updatePost, addComment } = require('./PostController')
const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.delete('/:id',  deletePost) // TODO - why require auth does not work?
router.post('/', requireAuth, addPost)
router.put('/comment/:id/',  addComment)
router.put('/:id', requireAuth, updatePost)

module.exports = router
