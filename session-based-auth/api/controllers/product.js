const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	// logic for getting all the products from the api.
	Product.find().then((products) => {
		console.log(products);
		res.json({ products: products });
	});
};

exports.getProduct = (req, res, next) => {
	// get a specific product from the api.

	const productId = req.params.productId;

	Product.findById(productId).then((product) => {
		if (!product) {
			return next(new Error("Not found product with this id"));
		}
		console.log(product);

		res.json({ product: product });
	});
};

exports.postProduct = (req, res, next) => {
	const { name, price } = req.body;

	const newProduct = new Product({ name: name, price: +price });

	newProduct
		.save()
		.then((savedProduct) => {
			console.log(savedProduct);
			return res.json({ product: savedProduct });
		})
		.catch((err) => {
			console.log("some error in saving product");
			return next(new Error("Some error in saving prodcut"));
		});
};
