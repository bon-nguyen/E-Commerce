const PCategory = require('../models/prodCategoryModel')
const slugify = require('slugify')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

// [POST] create category
const createProdCategory = asyncHandle(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newCategory = await PCategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] all categories
const getAllCategories = asyncHandle(async (req, res) => {
    try {
        const listCategories = await PCategory.find()
        res.json(listCategories)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] a categories
const getCategory = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const category = await PCategory.findById(id)
        res.json(category)
    } catch (error) {
        throw new Error(error)
    }
})

// [PUT] update category
const updateCategory = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newCategory = await PCategory.findByIdAndUpdate(id, req.body, { new: true })
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

// [DELETE] delete category
const deleteCategory = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteCategory = await PCategory.findByIdAndDelete(id)
        res.json(deleteCategory)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createProdCategory, getAllCategories, getCategory, updateCategory, deleteCategory }