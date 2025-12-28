import { useState } from "react";
import TokenContext from "./contextStore";

const TokenProvider = (props) => {
	const [accessToken, setAccessToken] = useState(undefined);

	const setAccessTokenHandler = (accessToken) => {
		setAccessToken(accessToken);
	};

	const tokenContext = {
		accessToken: accessToken,
		setAccessToken: setAccessTokenHandler,
	};

	return (
		<TokenContext.Provider value={tokenContext}>
			{props.children}
		</TokenContext.Provider>
	);
};

export default TokenProvider;
