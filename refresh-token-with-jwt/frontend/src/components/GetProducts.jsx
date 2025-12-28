import React, { useState, useEffect } from "react";

import axios from "axios";

const GetProducts = () => {
	const [products, setProducts] = useState([]);
	useEffect(() => {
		axios
			.get("https://localhost:5000/api/products")
			.then((result) => {
				const products = result.data.products;
				if (!products || products.length === 0) {
					console.log("Product list is empty. Try adding some");
					return;
				}
				console.log(products);
				setProducts(products);
			})
			.catch((error) => {
				throw new Error("Couldn't fetch the product " + error.message);
			});
	}, []);

	return (
		<div className="auth-container">
			<h2>Product List</h2>
			{products.map((product) => {
				return (
					<div key={product.price}>
						<h3>{product.name}</h3>
						<p>{product.price}</p>
					</div>
				);
			})}
		</div>
	);
};

export default GetProducts;
