import React, { useRef } from "react";
import axios from "axios";

import "./Forms.css";

const Register = () => {
	const nameRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const registerUserHandler = (event) => {
		event.preventDefault();

		const name = nameRef.current.value;
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		if (!name && !username && !password) {
			throw new Error("Please enter all the values");
		}

		console.log(name, username, password);
		// call the api to save the user in the database.
		axios
			.post("https://localhost:5000/api/auth/register", {
				name,
				username,
				password,
			})
			.then((response) => {
				console.log("You are registered Successfully");
				console.log(response);
				return;
			})
			.catch((error) => {
				console.log("Couldn't register you");
				throw new Error("Couldn't register you, try again " + error.message);
			});
		// oncedOne set the values to empty string
		nameRef.current.value = "";
		usernameRef.current.value = "";
		passwordRef.current.value = "";
	};

	return (
		<div className="auth-container">
			<h1>Register Page</h1>
			<form method="POST" onSubmit={registerUserHandler}>
				<label htmlFor="name">Name</label>
				<input type="text" id="name" name="name" ref={nameRef} />
				<br />
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

				<button type="submit">Register</button>
			</form>
		</div>
	);
};

export default Register;
