const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	Product.find().then((products) => {
		return res.status(200).json({ products });
	});
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;

	Product.findById(productId)
		.then((product) => {
			if (!product) {
				console.log("No product found with this Id");
				const error = new Error("No product found with this Id");
				error.statusCode = 400;
				return next(error);
			}

			// product found
			return res.status(200).json({ product });
		})
		.catch((error) => {
			console.log("Error in getting product.");
			const err = new Error("Error in fetching a product " + error.message);
			err.statusCode = 500;
			return next(err);
		});
};

exports.postProduct = (req, res, next) => {
	const { name, price } = req.body;

	const newProduct = new Product({
		name,
		price: +price,
	});

	newProduct
		.save()
		.then((product) => {
			console.log("product Created successfully");
			return res.status(200).json({ product: product });
		})
		.catch((error) => {
			console.log("Error in creating a product");
			const err = new Error("Error in creating a product " + error.message);
			err.statusCode = 500;
			return next(err);
		});
};
