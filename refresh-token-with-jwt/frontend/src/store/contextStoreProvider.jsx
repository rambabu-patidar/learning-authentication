import { useState, useCallback } from "react";
import TokenContext from "./contextStore";

const TokenProvider = (props) => {
	const [accessToken, setAccessToken] = useState(undefined);

	const setAccessTokenHandler = useCallback((accessToken) => {
		setAccessToken(accessToken);
	}, []);

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
