// The focus of this application is to implement the refresh token
// the UI will be very ugly and I may not be handling the errors to much gracefully.
// will keep oursef neive and straight up to the points.
const https = require("https");
const path = require("path");
const fs = require("fs");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const rootDir = require("./util/path");

const app = express();

app.use(express.json());
app.use(cookieParser());

const sslOptions = {
	key: fs.readFileSync(path.join(rootDir, "cert", "key.pem")),
	cert: fs.readFileSync(path.join(rootDir, "cert", "cert.pem")),
};

// app.use((req, res, next) => {
// 	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
// 	res.setHeader(
// 		"Access-Control-Allow-Methods",
// 		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
// 	);
// 	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
// 	res.setHeader("Access-Control-Allow-Credentials", "true");
// 	next();
// });

app.use(
	cors({
		origin: "https://localhost:5173",
		credentials: true,
	})
);

// to check if we are receiving the cookies for refresh token
// app.use((req, res, next) => {
// 	console.log(JSON.stringify(req.cookies, null, 2));
// 	// console.log(req.url);
// 	next();
// });

app.use(authRoutes);
app.use(productRoutes);

app.use((req, res, next) => {
	console.log("This endpoint is not supported yet by our web application.");
	res.status(404).json({
		message: "This endpoint is not supported yet by our web application.",
	});
});

app.use((error, req, res, next) => {
	console.log(error.statusCode, error.message);
	return res.status(error.statusCode).json({ errorMessage: error.message });
});

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected to the database!");

		// app.listen(5000, () => {
		// 	console.log("Started Listening on port 5000");
		// });
		https.createServer(sslOptions, app).listen(5000, () => {
			console.log("Started Https Server on port 5000");
		});
	})
	.catch(() => {
		console.log("Failed connecting to the DB");
	});
