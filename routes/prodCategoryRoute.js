const express = require("express")
const router = express.Router()
const { createProdCategory, getAllCategories, getCategory, updateCategory, deleteCategory } = require('../controller/prodCategoryCrt')
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware')

router.post("/", authMiddleware, createProdCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategories);

module.exports = router