import React, { useRef } from "react";
import useAxiosPrivate from "../api/useAxiosPrivate";

const AddProduct = () => {
	const nameRef = useRef();
	const priceRef = useRef();
	const axiosPrivate = useAxiosPrivate();

	const addProductHandler = (event) => {
		event.preventDefault();

		const name = nameRef.current.value;
		const price = priceRef.current.value;

		if (!name && !price) {
			throw new Error("name and price are compulsory");
		}

		// call axios api to add the prodcut in DB
		axiosPrivate
			.post("/product/create-product", {
				name,
				price,
			})
			.then((product) => {
				console.log("Product added successfully");
				console.log(product);
				return;
			})
			.catch((err) => {
				throw new Error("Could not add the product, try again " + err.message);
			});
	};

	return (
		<div className="auth-container">
			<h1>Create Product</h1>
			<form method="POST" onSubmit={addProductHandler}>
				<label htmlFor="name">Name</label>
				<input type="text" id="name" name="name" ref={nameRef} />
				<br />
				<label htmlFor="price">Price</label>
				<input type="Number" id="price" name="price" ref={priceRef} />
				<br />
				<button type="submit">Add Product</button>
			</form>
		</div>
	);
};

export default AddProduct;
