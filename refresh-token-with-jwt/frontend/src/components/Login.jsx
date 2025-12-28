import React, { useRef, useContext } from "react";
import useAxiosPrivate from "../api/useAxiosPrivate";
import tokenContext from "../store/contextStore";

const Login = () => {
	const axiosPrivate = useAxiosPrivate();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const accessTokenContext = useContext(tokenContext);

	const loginUserHandler = (event) => {
		event.preventDefault();

		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		if (!username && !password) {
			throw new Error("Enter all the fields");
		}

		console.log(username, password);

		// now calll the api for logging in
		axiosPrivate
			.post("https://localhost:5000/api/auth/login", {
				username,
				password,
			})
			.then((response) => {
				console.log("You're logged in successfully");
				console.log(response);
				// we'll get the the access token here
				// Let's store it in context.
				accessTokenContext.setAccessToken(response.data.accessToken);
				return;
			})
			.catch((error) => {
				console.log(error);
				console.log("Couldn't log you in");
				throw new Error(
					"Couldn't log you in, try again! " +
						error.response?.data?.errorMessage
				);
			});

		//reset values to empty
		usernameRef.current.value = "";
		passwordRef.current.value = "";
	};

	return (
		<div className="auth-container">
			<h1>Login Page</h1>
			<form method="POST" onSubmit={loginUserHandler}>
				<label htmlFor="username">Email</label>
				<input type="email" id="username" name="username" ref={usernameRef} />
				<br />
				<label htmlFor="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					ref={passwordRef}
				/>
				<br />

				<button type="submit">Login</button>
			</form>
		</div>
	);
};

export default Login;
