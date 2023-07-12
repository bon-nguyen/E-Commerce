const express = require("express")
const router = express.Router()
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser } = require('../controller/userCrl')

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all', getAllUser)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)

module.exports = router