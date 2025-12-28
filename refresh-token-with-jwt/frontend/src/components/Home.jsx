import React, { useState } from "react";

import Navigation from "./Navigation";
import Register from "./Register";
import Login from "./Login";
import Logout from "./Logout";
import GetProducts from "./GetProducts";
import AddProduct from "./AddProduct";
import "./Home.css";

const Home = () => {
	const [operation, setOperation] = useState("Register");

	const onRegisterClickHandler = () => {
		setOperation("Register");
	};

	const onLoginClickHandler = () => {
		setOperation("Login");
	};

	const onLogoutClickHandler = () => {
		setOperation("Logout");
	};

	const onGetProductHandler = () => {
		setOperation("GetProduct");
	};

	const onCreateProductHandler = () => {
		setOperation("CreateProduct");
	};

	return (
		<main>
			<h1> Refresh Token Learning Project</h1>
			<Navigation
				onRegisterClick={onRegisterClickHandler}
				onLoginClick={onLoginClickHandler}
				onLogoutClick={onLogoutClickHandler}
				onCreateProductClick={onCreateProductHandler}
				onGetProductsClick={onGetProductHandler}
			/>

			{operation === "Register" && <Register />}
			{operation === "Login" && <Login />}
			{operation === "Logout" && <Logout />}
			{operation === "GetProduct" && <GetProducts />}
			{operation === "CreateProduct" && <AddProduct />}
		</main>
	);
};

export default Home;
