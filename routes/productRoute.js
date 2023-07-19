const express = require("express")
const router = express.Router()
const { getAllProduct, createProduct, getProduct, updateProduct, deleteProduct } = require('../controller/productCrt')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')

router.get('/', getAllProduct)
router.post('/', createProduct)
router.get('/:id', getProduct)
router.put('/:id', updateProduct)
router.delete('/:id', authMiddleware, isAdmin, deleteProduct)

module.exports = router