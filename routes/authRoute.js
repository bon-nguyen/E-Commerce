const express = require("express")
const router = express.Router()
const { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logoutUser, updatePassword, forgotPasswordToken } = require('../controller/userCrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')

router.post('/forgot-password-token', forgotPasswordToken)
router.get("/logout", logoutUser);
router.put('/password', authMiddleware, updatePassword)
router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/refetch', handleRefreshToken)

router.get('/all', getAllUser)
router.get('/:id', getUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)


router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)


module.exports = router