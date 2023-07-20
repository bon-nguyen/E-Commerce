const Coupon = require('../models/couponModel')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

// [POST] create coupon
const createCoupon = asyncHandle(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] get all
const getAllCoupon = asyncHandle(async (req, res) => {
    try {
        const allCoupon = await Coupon.find()
        res.json(allCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

// [PUT] update coupon
const updateCoupon = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const resUpdate = await Coupon.findByIdAndUpdate(id, req.body, { new: true })
        res.json(resUpdate)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] detail
const getCoupon = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const detail = await Coupon.findById(id)
        res.json(detail)
    } catch (error) {
        throw new Error(error)
    }
})

// [DELETE] delete coupon
const deleteCoupon = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const resDelete = await Coupon.findByIdAndRemove(id)
        res.json(resDelete)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createCoupon, getAllCoupon, updateCoupon, getCoupon, deleteCoupon }