
const express = require("express")
const router = express.Router()
const { createCoupon, getAllCoupon, updateCoupon, getCoupon, deleteCoupon } = require('../controller/couponCrt')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')

router.get('/', getAllCoupon)
router.post('/', authMiddleware, createCoupon)
router.get('/:id', getCoupon)
router.put('/:id', authMiddleware, updateCoupon)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupon)

module.exports = router