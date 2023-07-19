const express = require("express")
const router = express.Router()
const { createBrand, getAllBrands, getBrand, updateBrand, deleteBrand } = require('../controller/brandCrt')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')

router.get("/:id", getBrand);
router.get("/", getAllBrands);
router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.delete("/:id", authMiddleware, deleteBrand);


module.exports = router