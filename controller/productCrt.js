const Product = require('../models/productModel')
const User = require('../models/userModel')
const slugify = require('slugify')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

// [GET] get all product
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


// [PUT] create product
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

// [GET] get product
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

// [PUT] update product
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

// [DELETE] delete product
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

// [PUT] add wish list
const addToWishList = asyncHandle(async (req, res) => {
    const loginUserId = req?.user?.id
    const { prodId } = req.body
    validateMongoDbId(loginUserId)
    validateMongoDbId(prodId)
    let updateOperation;
    const user = await User.findById(loginUserId)

    const isWishList = user.wishlist.includes(prodId)
    if (isWishList) {
        updateOperation = { $pull: { wishlist: prodId }, }
    } else {
        updateOperation = { $push: { wishlist: prodId }, }
    }
    try {
        const updatedWishlist = await User.findByIdAndUpdate(
            loginUserId,
            {
                ...updateOperation,
            },
            { new: true }
        );
        res.json(updatedWishlist)
    } catch (error) {
        throw new Error(error)
    }
})

// [PUT] Rating
const rating = asyncHandle(async (req, res) => {
    const { id } = req?.user
    const { star, prodId, comment } = req.body
    try {
        const updateProduct = await Product.findOneAndUpdate(
            {
                _id: prodId,
                'ratings.postedBy': id,
            },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                },
            },
            {
                new: true,
            }
        ).lean();

        if (!updateProduct) {
            const newRating = {
                star,
                comment,
                postedBy: id,
            };
            await Product.findByIdAndUpdate(prodId, {
                $push: { ratings: newRating },
            });
        }
        const getAllRatings = await Product.findById(prodId);
        const totalRanting = getAllRatings.ratings.length
        const ratingSum = getAllRatings.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0)

        const finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRanting: Math.round(ratingSum / totalRanting)
            },
            { new: true }
        )
        res.json(finalProduct)
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { getAllProduct, createProduct, getProduct, updateProduct, deleteProduct, addToWishList, rating }