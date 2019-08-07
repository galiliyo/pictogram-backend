const express = require('express')
const {getUsers, getUser, updateUser,toggleLike} = require('./UserController')
const router = express.Router()


router.patch('/likes',toggleLike)
router.get('/',getUsers)
router.get('/:id',getUser)
router.put('/',updateUser)

module.exports = router