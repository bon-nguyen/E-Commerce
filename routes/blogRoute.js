const express = require("express")
const router = express.Router()
const { createBlog, getAllBlog, getBlog, updateBlog, deleteBlog, likeBlog, disLikeBlog } = require('../controller/postCrt')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.put('/like', authMiddleware, likeBlog)
router.put('/disLike', authMiddleware, disLikeBlog)
router.post('/', createBlog)
router.get('/', getAllBlog)
router.get('/:id', getBlog)
router.put('/:id', authMiddleware, updateBlog)
router.delete('/:id', authMiddleware, deleteBlog)

module.exports = router