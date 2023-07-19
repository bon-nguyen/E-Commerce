const Brand = require('../models/brandModel')
const slugify = require('slugify')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

// [GET] a Brands
const getBrand = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const dataDetail = await Brand.findById(id)
        res.json(dataDetail)
    } catch (error) {
        throw new Error(error)
    }
})

// [POST] create Brand
const createBrand = asyncHandle(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] all Brands
const getAllBrands = asyncHandle(async (req, res) => {
    try {
        const listBrands = await Brand.find()
        res.json(listBrands)
    } catch (error) {
        throw new Error(error)
    }
})



// [PUT] update Brand
const updateBrand = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true })
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

// [DELETE] delete Brand
const deleteBrand = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand }