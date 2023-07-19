const Blog = require('../models/blogModel')
const slugify = require('slugify')
const asyncHandle = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')
const { query } = require('express')

// [POST] create blog
const createBlog = asyncHandle(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] get all
const getAllBlog = asyncHandle(async (req, res) => {
    try {
        const queryObj = { ...req.query };
        const excludeFields = ["page", "limit"]
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj);
        let query = Blog.find(JSON.parse(queryStr))
        // Implement pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit);

        // Count total pages
        const total = await Blog.countDocuments(queryObj);
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

// [PUT] update blog
const updateBlog = asyncHandle(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] detail blog
const getBlog = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const detailBlog = await Blog.findById(id)
        await Blog.findByIdAndUpdate(id,
            {
                $inc: { numViews: 1 }
            },
            {
                new: true
            })
        res.json(detailBlog)
    } catch (error) {
        throw new Error(error)
    }
})

// [DELETE] remove blog
const deleteBlog = asyncHandle(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const blogDelete = await Blog.findByIdAndRemove(id)
        res.json(blogDelete)
    } catch (error) {
        throw new Error(error)
    }
})

// [PUT] like blog
const likeBlog = asyncHandle(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    const blog = await Blog.findById(blogId)

    // Find the login user 
    const loginUserId = req?.user?._id;

    // Check if user has already liked or dislike the blog
    const isLiked = blog.likes.includes(loginUserId);
    const isDisliked = blog.dislikes.includes(loginUserId);

    let updateOperation;
    let updateFlag;

    if (isLiked) {
        // If already like, remove like 
        updateOperation = { $pull: { likes: loginUserId } }
        updateFlag = false;
    } else if (isDisliked) {
        // If already disliked, remove dislike
        updateOperation = { $pull: { dislikes: loginUserId } };
        updateFlag = false;
    } else {
        // If neither liked nor disliked, add like
        updateOperation = { $push: { likes: loginUserId } };
        updateFlag = true;
    }
    try {
        // Update the blog with the defined operation and set the isLiked/isDisliked flag
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                ...updateOperation,
                isLiked: updateFlag,
                isDisliked: false, // Ensure the dislike flag is reset
            },
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error)
    }
})


// [PUT] dis like blog
const disLikeBlog = asyncHandle(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    const blog = await Blog.findById(blogId)

    // Find the login user 
    const loginUserId = req?.user?._id;

    // Check if user has already liked or dislike the blog
    const isLiked = blog.likes.includes(loginUserId);
    const isDisliked = blog.dislikes.includes(loginUserId);

    let updateOperation;
    let updateFlag;

    if (isLiked) {
        // If already like, remove like 
        updateOperation = { $pull: { likes: loginUserId } }
        updateFlag = false;
    } else if (isDisliked) {
        // If already disliked, remove dislike
        updateOperation = { $pull: { dislikes: loginUserId } };
        updateFlag = false;
    } else {
        // If neither liked nor disliked, add like
        updateOperation = { $push: { likes: loginUserId } };
        updateFlag = true;
    }
    try {
        // Update the blog with the defined operation and set the isLiked/isDisliked flag
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                ...updateOperation,
                isDisliked: updateFlag,
                isLiked: false, // Ensure the dislike flag is reset
            },
            { new: true }
        );
        res.json(updatedBlog);
    } catch (error) {
        throw new Error(error)
    }
})


module.exports = { createBlog, getAllBlog, updateBlog, getBlog, deleteBlog, likeBlog, disLikeBlog }