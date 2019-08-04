const express = require('express')
const requireAuth = require('../../middlewares/requireAuth.middleware')
const { getPosts, getPost, deletePost, addPost, updatePost } = require('./PostController')
const router = express.Router()

router.get('/', getPosts)
router.get('/:id', getPost)
router.delete('/:id', requireAuth, deletePost)
router.post('/', requireAuth, addPost)
router.put('/:id', requireAuth, updatePost)

module.exports = router
