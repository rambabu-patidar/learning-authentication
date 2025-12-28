const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
	// get the cookie
	// extract the access token
	// validate the access token
	// if the token is valid the user is authenticated

	const authHeader = req.headers.authorization;

	if (!authHeader && !authHeader?.startsWith("Bearer ")) {
		const error = new Error("No Authorization header present");
		error.statusCode = 401;
		return next(error);
	}

	const accessToken = authHeader.split(" ")[1];

	// verify the accessToken
	try {
		// verify method throws error if doesn't match.
		const decodedAccessToken = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET
		);
		req.user = decodedAccessToken.id;
		return next();
	} catch (error) {
		console.log("Invalid token or expired");
		const err = new Error("Invalid token or expired token " + error.message);
		err.statusCode = 401;
		return next(err);
	}
};

module.exports = isAuth;
