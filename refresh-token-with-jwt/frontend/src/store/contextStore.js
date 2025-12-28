import { createContext } from "react";

const tokenContext = createContext({
	accessToken: undefined,
	setAccessToken: () => {},
});

export default tokenContext;
