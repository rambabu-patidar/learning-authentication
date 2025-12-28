import React from "react";

const Logout = () => {
	const logoutUserHandler = (event) => {
		event.preventDefault();

		// call the api to logout the user
		//
	};

	return (
		<div className="auth-container">
			<h1>Logout Page</h1>
			<form method="POST" onSubmit={logoutUserHandler}>
				<button type="submit">Logout</button>
			</form>
		</div>
	);
};

export default Logout;
