const express = require('express')
// const requireAuth = require('../../middlewares/requireAuth.middleware')
const { addChat, getChat, updateChat } = require('./ChatController')
const router = express.Router()


router.post('/', addChat)
router.get('/:id', getChat)
router.put('/:id', updateChat)


module.exports = router