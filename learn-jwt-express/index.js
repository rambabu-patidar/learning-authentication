require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const uuid = require("uuid").v4;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json()); // used for parsing the incoming bodies.
app.use(cookieParser());

const users = [
	{
		id: uuid(),
		username: "rambabupatidar_",
		passwordHash: bcrypt.hashSync(process.env.USER_PASSWORD, 10),
	},
];

const signToken = (user) => {
	return jwt.sign(
		{
			sub: user.id,
			username: user.username,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: "15m",
		}
	);
};

const authMiddleware = (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ error: "Not Authenticated" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
		if (error) {
			return res.status(401).json({
				error: "Invalid or expired token, Your token has been tampered!",
			});
		}
		req.user = decoded;
		next();
	});
};

app.use(
	express.static(path.join(path.dirname(require.main.filename), "public"))
);

app.post("/api/login", (req, res, next) => {
	const { username, password } = req.body;
	console.log(username, password);
	const user = users.find((user) => user.username === username);

	if (!user) {
		return res.status(401).json({ error: "Invalid Credentials" });
	}

	const ok = bcrypt.compareSync(password, user.passwordHash);

	if (!ok) {
		return res.status(401).json({ error: "Invalid Credentials" });
	}

	// otherwise now generate the token
	const token = signToken(user);

	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 15 * 60 * 1000,
	});

	res.json({ messaage: "Logged In!" });
});

app.get("/api/me", authMiddleware, (req, res, next) => {
	res.json({ user: req.user });
});

app.post("/api/logout", (req, res, next) => {
	res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
	res.json({ message: "Logged out Successfully!" });
});

app.listen(5000, () => {
	console.log("Started Listening on port 5000");
});
