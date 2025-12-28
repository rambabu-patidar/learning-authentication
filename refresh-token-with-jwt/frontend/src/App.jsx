import React, { useEffect, useContext } from "react";
import Home from "./components/Home";
import useAxiosPrivate from "./api/useAxiosPrivate";

import tokenContext from "./store/contextStore";

import "./App.css";

const App = () => {
	const axiosPrivate = useAxiosPrivate();
	const { setAccessToken } = useContext(tokenContext);
	// Get the token one time when the page refreshed or reloaded.

	useEffect(() => {
		axiosPrivate
			.get("/auth/refresh")
			.then((response) => {
				setAccessToken(response.data.accessToken);
			})
			.catch(() => {
				console.log("Can't get access token of page reload");
			});
	}, [setAccessToken, axiosPrivate]);
	return <Home />;
};

export default App;
