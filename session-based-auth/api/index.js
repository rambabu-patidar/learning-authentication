require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const adminRoutes = require("./routes/admin");

const app = express();

const store = MongoStore.create({
	mongoUrl: process.env.MONGODB_URI,
	collectionName: "sessionsStore",
});

app.use(express.json());

app.use(
	session({
		name: "mern_session",
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);

app.use(authRoutes);
app.use(productRoutes);
app.use(adminRoutes);

app.use((req, res, next) => {
	console.log("Path not defined so in this route");
	res.send("This is the not path defined middleware");
});

app.use((error, req, res, next) => {
	console.log(error.message);
	next();
});

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log("Connected with Database!");
		app.listen(5000, () => {
			console.log("Started Listening on port 5000");
		});
	})
	.catch((err) => {
		console.log(err);
	});
