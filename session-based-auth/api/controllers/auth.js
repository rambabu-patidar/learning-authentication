const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.postRegister = (req, res, next) => {
	const { name, username, password } = req.body;

	/* check if the user with this email already exists
    hash the user password with bcrypt
    save the user in the database.

    I will do the bare minimums here as I am focusing on the how do we implement sessions.
  */

	bcrypt
		.hash(password, 10)
		.then((hashedPassword) => {
			const newUser = new User({
				name: name,
				username: username,
				password: hashedPassword,
			});

			return newUser.save();
		})
		.then((user) => {
			return res.json({ user: user });
		})
		.catch((err) => {
			console.log("Error in hasing the password");
			return next(new Error("Error in hasing the password"));
		});
};

exports.postLogin = (req, res, next) => {
	const { username, password } = req.body;

	// if the user exists
	// compare the passwords
	// setup the session
	let loggedInUser = null;
	User.findOne({ username: username })
		.then((user) => {
			if (!user) {
				console.log("No user with this email found");
				return next(new Error("No user with this email found"));
			}

			// we found the user.
			// compare password
			loggedInUser = user;
			return bcrypt.compare(password, user.password);
		})
		.then((doesMatch) => {
			if (!doesMatch) {
				console.log("Password doesn't matched");
				return next(new Error("password doesn't matched"));
			}

			// password matched
			// create a session
			req.session.isLoggedIn = true;
			req.session.user = loggedInUser;
			req.session.save((error) => {
				if (error) {
					console.log("error in saving the session");
					return next(new Error("Error in saving the session"));
				}

				return res.json({
					message: "LoggedIn Successfully",
					user: loggedInUser,
				});
			});
		})
		.catch((error) => {
			console.log("Couldn't log you in");
			return next(new Error("Couldn't log you in"));
		});
};

exports.postLogout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.log("Couldn't log you out!");
			return;
		}

		console.log("You are logged out successfully.");
		return res
			.status(200)
			.json({ message: "You are logged out successfully." });
	});
};
