const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { generateToken } = require('../config/jwtToken')

// [POST] CREATE USER
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("User Already Exists");
    }
});

// [POST] LOGIN
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // check if user exists or not
    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

// [GET] LIST USER
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})

// [GET] A USER
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const detailsUser = await User.findById(id)
        res.json(detailsUser)
    } catch (error) {
        throw new Error(error)
    }
})

// [DELETE] USER
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const resDelete = await User.findByIdAndDelete(id)
        res.json(resDelete)
    } catch (error) {
        throw new Error(error)
    }
})

// [PUT] UPDATE USER
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const resUpdate = await User.findByIdAndUpdate(id,
            {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            }
            , { new: true })
        res.json(resUpdate)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = { createUser, loginUser, getAllUser, getUser, deleteUser, updateUser }