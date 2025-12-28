import Home from "./components/Home";
import "./App.css";

import TokenProvider from "./store/contextStoreProvider";

const App = () => {
	return (
		<TokenProvider>
			<Home />
		</TokenProvider>
	);
};

export default App;
