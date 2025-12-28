const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.postRegister = (req, res, next) => {
	const { name, username, password } = req.body;

	// if the same user exists in the databse
	// encrypt the password
	// save it in the database.

	bcrypt
		.hash(password, 10)
		.then((hashedPassword) => {
			if (!hashedPassword) {
				console.log("Hashed password is null or undefined");
				const err = new Error("Hashed password is null or undefined ");
				err.statusCode = 500;
				return next(err);
			}
			const user = new User({
				name: name,
				username: username,
				password: hashedPassword,
			});

			return user.save();
		})
		.then((user) => {
			return res
				.status(200)
				.json({ message: "Registered Successfully", user: user });
		})
		.catch((error) => {
			console.log("Can't hash the password");
			const err = new Error("Can't hash the password " + error.message);
			err.statusCode = 500;
			return next(err);
		});
};

exports.postLogin = (req, res, next) => {
	// check if the user exists
	// check if the user is already loggedin  (IMPLEMENT THIS LATER)
	// validate the password
	// create a jwt access token and jwt refresh token
	// store the refresh token in the db and access token will be sent to the frontend as response

	const { username, password } = req.body;
	let loggingUser = null;
	let refreshTokenGlobal = null;
	User.findOne({ username: username })
		.then((user) => {
			if (!user) {
				console.log("No user exist with this username");
				const err = new Error("No user exist with this username");
				err.statusCode = 404;
				throw err;
			}
			loggingUser = user;

			return bcrypt.compare(password, user.password);
		})
		.then((doesMatch) => {
			if (!doesMatch) {
				console.log("Invalid Credentials");
				const err = new Error("Invalid Credentialss");
				err.statusCode = 401;
				throw err;
			}

			const refreshToken = jwt.sign(
				{ id: loggingUser._id },
				process.env.REFRESH_TOKEN_SECRET,
				{
					expiresIn: "1d",
				}
			);
			refreshTokenGlobal = refreshToken;

			loggingUser.refreshToken = refreshToken;
			return loggingUser.save();
		})
		.then((userWithRefreshToken) => {
			const accessToken = jwt.sign(
				{ id: loggingUser._id },
				process.env.ACCESS_TOKEN_SECRET,
				{
					expiresIn: "1m",
				}
			);

			res.cookie("learn-jwt-refresh-token", refreshTokenGlobal, {
				httpOnly: true,
				secure: true,
				sameSite: "none",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			return res.json({
				message: "LoggedIn Sucessfully!",
				accessToken: accessToken,
			});
		})
		.catch((error) => {
			console.log(error);
			return next(error);
		});
};

exports.getAccessToken = (req, res, next) => {
	const cookies = req.cookies;

	if (!cookies?.["learn-jwt-refresh-token"]) {
		console.log("No cookies found");
		return res.status(401).json({ message: "Unauthorized" });
	}

	const refreshToken = cookies["learn-jwt-refresh-token"];
	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		(error, decoded) => {
			if (error) {
				console.log("Refresh Token doesn't match!");
				return res
					.status(401)
					.json({ message: "Unauthorized: Token doesn't match" });
			}

			return User.findById(decoded.id).then((foundUser) => {
				if (!foundUser || refreshToken !== foundUser.refreshToken) {
					console.log("Refresh token doesn't match");
					return res.status(401).json({
						message: "Unauthorized: User with this token doesn't exists",
					});
				}

				const accessToken = jwt.sign(
					{ id: foundUser._id },
					process.env.ACCESS_TOKEN_SECRET,
					{
						expiresIn: "5m",
					}
				);

				return res.status(200).json({ accessToken: accessToken });
			});
		}
	);
};

exports.postLogout = (req, res, next) => {
	// invalidate the refresh token and access token
	// remove refresh token from the users object

	const refreshToken = req.cookies["learn-jwt-refresh-token"];

	if (refreshToken) {
		return User.findOneAndUpdate(
			{ refreshToken },
			{ $unset: { refreshToken: 1 } }
		)
			.then((response) => {
				console.log("Removed the refresh token from DB");
				// now clear the response cookie

				res.clearCookie("learn-jwt-refresh-token", {
					httpOnly: true,
					secure: true,
					sameSite: "none",
					path: "/",
				});

				return res
					.status(200)
					.json({ messaage: "You're logged out successfully!" });
			})
			.catch((error) => {
				const err = new Error(
					"Can't log you out, something went wrong! " + error.message
				);
				err.statusCode = 500;
				return next(err);
			});
	}
};
