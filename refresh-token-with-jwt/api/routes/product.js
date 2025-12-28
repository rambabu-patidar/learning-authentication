const express = require("express");
const productController = require("../controllers/product");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/api/products", productController.getProducts);

router.get("/api/product/:productId", productController.getProduct);

router.post(
	"/api/product/create-product",
	isAuth,
	productController.postProduct
);

module.exports = router;
