const express = require("express")
const router = express.Router()
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser } = require('../controller/userCrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.get("/logout", logoutUser);
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/refetch', handleRefreshToken)

router.get('/all', authMiddleware, isAdmin, getAllUser)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)


router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)

module.exports = router