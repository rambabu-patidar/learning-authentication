import React from "react";

import "./Navigation.css";

const Navigation = (props) => {
	return (
		<nav className="navigation">
			<ul>
				<li onClick={props.onGetProductsClick}>Get Products</li>
				<li onClick={props.onCreateProductClick}>Create Product</li>
				<li onClick={props.onRegisterClick}>Register</li>
				<li onClick={props.onLoginClick}>Login</li>
				<li onClick={props.onLogoutClick}>Logout</li>
			</ul>
		</nav>
	);
};

export default Navigation;
