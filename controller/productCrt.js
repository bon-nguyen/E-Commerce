const Product = require('../models/productModel')
const slugify = require('slugify')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')


const getAllProduct = asyncHandle(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);
        let queryStr = JSON.stringify(queryObj);
        let query = Product.find(JSON.parse(queryStr))
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }
        // Implement pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit);
        // Count total pages
        const total = await Product.countDocuments(queryObj);
        //Calculate total pages
        const totalPages = Math.ceil(total / limit);
        //Execute the query
        const items = await query.exec();
        res.json({
            items,
            total,
            page,
            limit,
            totalPages,
        })
    } catch (error) {
        throw new Error(error)
    }
})

const createProduct = asyncHandle(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getProduct = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const detailProduct = await Product
            .findById(id)
            .populate("likes")
            .populate("dislikes");
        res.json(detailProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const updateProduct = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const resDelete = await Product.findByIdAndDelete(id)
        res.json(resDelete)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { getAllProduct, createProduct, getProduct, updateProduct, deleteProduct }