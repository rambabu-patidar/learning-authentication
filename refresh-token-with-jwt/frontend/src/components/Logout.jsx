import React, { useContext } from "react";
import tokenContext from "../store/contextStore";
import useAxiosPrivate from "../api/useAxiosPrivate";

const Logout = () => {
	const axiosPrivate = useAxiosPrivate();
	const tokenAccessContext = useContext(tokenContext);

	const logoutUserHandler = (event) => {
		event.preventDefault();

		axiosPrivate
			.post("/auth/logout")
			.then((response) => {
				console.log(response.data.message);

				tokenAccessContext.setAccessToken(null);
				return;
			})
			.catch((error) => {
				console.log("Failed to log you out! Please try again");
				console.log(error.message);
			});
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
