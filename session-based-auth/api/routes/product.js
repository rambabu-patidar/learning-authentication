const express = require("express");
const productController = require("../controllers/product");

const authMiddleware = require("../middleware/isAuth");

const router = express.Router();

router.get(
	"/api/products",
	authMiddleware.isAuth,
	productController.getProducts
);

router.get(
	"/api/product/:productId",
	authMiddleware.isAuth,
	productController.getProduct
);

router.post(
	"/api/add-product",
	authMiddleware.isAuth,
	productController.postProduct
);

module.exports = router;
