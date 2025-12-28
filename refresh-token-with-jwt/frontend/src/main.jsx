import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import TokenProvider from "./store/contextStoreProvider";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<TokenProvider>
			<App />
		</TokenProvider>
	</StrictMode>
);
