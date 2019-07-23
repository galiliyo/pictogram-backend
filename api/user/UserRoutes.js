const express = require('express')
const {getUsers, getUser, updateUser} = require('./UserController')
const router = express.Router()


router.get('/',getUsers)
router.get('/:id',getUser)
router.put('/',updateUser)

module.exports = router